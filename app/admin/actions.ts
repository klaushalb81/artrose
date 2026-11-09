"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { endAdminSession, requireAdmin, startAdminSession } from "@/lib/admin-auth";
import { deleteStreamVideo, getStreamVideo, requireSignedUrls } from "@/lib/cloudflare-api";
import { sendViewingLinkEmail } from "@/lib/email";
import { env } from "@/lib/env";
import { extendPurchase, getPurchaseForResend } from "@/lib/purchases";
import { getVideoPackage, packageInputSchema, updateVideoPackage } from "@/lib/package";
import {
  createVideo,
  deleteVideo,
  streamUidSchema,
  updateVideo,
  videoIdSchema,
  videoInputSchema,
} from "@/lib/videos";

export type FormState = { error?: string; ok?: string } | undefined;

// ---------------------------------------------------------------------------
// Login
// ---------------------------------------------------------------------------

export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const password = String(formData.get("password") ?? "");
  const ok = await startAdminSession(password);
  if (!ok) {
    // Slow down guessing.
    await new Promise((r) => setTimeout(r, 1000));
    return { error: "Feil passord." };
  }
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await endAdminSession();
  redirect("/admin/login");
}

// ---------------------------------------------------------------------------
// Video package (name, description, price)
// ---------------------------------------------------------------------------

export async function updatePackageAction(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = packageInputSchema.safeParse({
    title: formData.get("title") ?? "",
    description: formData.get("description") ?? "",
    priceKr: formData.get("priceKr") ?? "",
  });
  if (!parsed.success) return { error: firstError(parsed.error) };

  await updateVideoPackage(parsed.data);
  revalidatePath("/videoer");
  revalidatePath("/priser");
  revalidatePath("/admin");
  return { ok: "Videopakken er oppdatert." };
}

// ---------------------------------------------------------------------------
// Videos in the package
// ---------------------------------------------------------------------------

function parseVideoForm(formData: FormData) {
  return videoInputSchema.safeParse({
    title: formData.get("title") ?? "",
    description: formData.get("description") ?? "",
    active: formData.get("active") === "on",
  });
}

function firstError(error: { issues: { message: string }[] }): string {
  return error.issues[0]?.message ?? "Ugyldige verdier.";
}

export async function createProductAction(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();

  const parsed = parseVideoForm(formData);
  if (!parsed.success) return { error: firstError(parsed.error) };

  const uid = streamUidSchema.safeParse(formData.get("cloudflareVideoUid") ?? "");
  if (!uid.success) return { error: "Last opp en video (eller lim inn en Cloudflare video-ID) først." };

  try {
    const video = await getStreamVideo(uid.data);
    if (!video) return { error: "Fant ikke videoen hos Cloudflare." };
    if (!video.requireSignedURLs) await requireSignedUrls(uid.data);
  } catch (error) {
    console.error("[admin] Cloudflare check failed", error);
    return { error: "Kunne ikke kontakte Cloudflare. Prøv igjen." };
  }

  let id: string;
  try {
    id = await createVideo({ ...parsed.data, cloudflareVideoUid: uid.data });
  } catch (error) {
    if (String(error).includes("cloudflare_video_uid")) return { error: "Denne videoen er allerede lagt til." };
    console.error("[admin] create product failed", error);
    return { error: "Kunne ikke lagre videoen." };
  }

  revalidatePath("/videoer");
  revalidatePath("/admin");
  redirect(`/admin/produkter/${id}?lagret=1`);
}

export async function updateProductAction(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const id = videoIdSchema.safeParse(formData.get("id"));
  if (!id.success) return { error: "Ukjent produkt." };

  const parsed = parseVideoForm(formData);
  if (!parsed.success) return { error: firstError(parsed.error) };

  await updateVideo(id.data, parsed.data);
  revalidatePath("/videoer");
  revalidatePath("/admin");
  revalidatePath(`/admin/produkter/${id.data}`);
  return { ok: "Endringene er lagret." };
}

export async function deleteProductAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = videoIdSchema.parse(formData.get("id"));
  const result = await deleteVideo(id);
  if (!result.deleted) redirect(`/admin/produkter/${id}?feil=solgt`);
  try {
    await deleteStreamVideo(result.uid);
  } catch (error) {
    console.error("[admin] product deleted but Cloudflare video was not", error);
  }
  revalidatePath("/videoer");
  revalidatePath("/admin");
  redirect("/admin?slettet=1");
}

/** Removes a video that was uploaded but never saved as a product. */
export async function discardUploadAction(uid: string): Promise<void> {
  await requireAdmin();
  const parsed = streamUidSchema.safeParse(uid);
  if (parsed.success) await deleteStreamVideo(parsed.data).catch(() => {});
}

// ---------------------------------------------------------------------------
// Purchases
// ---------------------------------------------------------------------------

export async function extendPurchaseAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = videoIdSchema.parse(formData.get("id"));
  await extendPurchase(id);
  revalidatePath("/admin/salg");
}

export async function resendLinkAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = videoIdSchema.parse(formData.get("id"));
  const purchase = await getPurchaseForResend(id);
  if (!purchase) redirect("/admin/salg?epost=mangler");

  const pkg = await getVideoPackage();
  const result = await sendViewingLinkEmail({
    to: purchase.email,
    watchUrl: `${env().SITE_URL}/watch/${purchase.viewingToken}`,
    expiresAt: purchase.expiresAt,
    packageTitle: pkg.title,
  });
  redirect(result.sent ? "/admin/salg?epost=sendt" : "/admin/salg?epost=feil");
}
