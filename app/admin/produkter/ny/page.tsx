import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import NewProductForm from "./NewProductForm";

export default async function NewProductPage() {
  await requireAdmin();
  return (
    <>
      <p className="caption" style={{ marginBottom: 16 }}>
        <Link href="/admin">← Produkter</Link>
      </p>
      <h1 className="display-sm" style={{ marginBottom: 32 }}>
        Nytt videoprodukt
      </h1>
      <NewProductForm />
    </>
  );
}
