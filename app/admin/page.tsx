import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { getStreamVideos } from "@/lib/cloudflare-api";
import { getVideoPackage } from "@/lib/package";
import { getSalesStats } from "@/lib/purchases";
import { formatPrice, listAllVideos } from "@/lib/videos";
import PackageForm from "./PackageForm";
import StatusPill from "./StatusPill";

function toKrInput(ore: number): string {
  return (ore / 100).toFixed(ore % 100 === 0 ? 0 : 2).replace(".", ",");
}

export default async function AdminHome({ searchParams }: PageProps<"/admin">) {
  await requireAdmin();
  const { slettet } = await searchParams;

  const [pkg, videos, stats] = await Promise.all([getVideoPackage(), listAllVideos(), getSalesStats()]);
  const statuses = await getStreamVideos(videos.map((v) => v.cloudflare_video_uid));
  const visible = videos.filter((v) => v.active).length;

  return (
    <>
      <div className="admin-head">
        <div>
          <h1 className="display-sm">Videopakken</h1>
          <p className="caption" style={{ marginTop: 8 }}>
            {formatPrice(pkg)} for 6 måneders tilgang til alle synlige videoer · {stats.paidCount} salg ·{" "}
            {formatPrice({ price: stats.revenue, currency: pkg.currency })} totalt
          </p>
        </div>
      </div>

      <PackageForm pkg={{ title: pkg.title, description: pkg.description, priceKr: toKrInput(pkg.price) }} />

      <div className="admin-head" style={{ marginTop: 64 }}>
        <div>
          <h2 className="display-sm">Videoer i pakken</h2>
          <p className="caption" style={{ marginTop: 8 }}>
            {visible} av {videos.length} synlige. Kundene ser alle synlige videoer, også de du legger til senere.
          </p>
        </div>
        <Link href="/admin/produkter/ny" className="btn btn-filled">
          + Legg til video
        </Link>
      </div>

      {slettet && <p className="admin-ok">Videoen er slettet.</p>}

      {videos.length === 0 ? (
        <div className="callout" style={{ margin: 0 }}>
          <span className="label">Ingen videoer ennå</span>
          <p>Klikk «Legg til video» for å laste opp den første. Butikken åpner for kjøp når minst én video er synlig.</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Tittel</th>
                <th>For kundene</th>
                <th>Video</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {videos.map((v, i) => (
                <tr key={v.id}>
                  <td>{String(i + 1).padStart(2, "0")}</td>
                  <td>
                    <Link href={`/admin/produkter/${v.id}`} className="admin-strong">
                      {v.title}
                    </Link>
                  </td>
                  <td>{v.active ? <span className="pill pill-ok">Synlig</span> : <span className="pill">Skjult</span>}</td>
                  <td>
                    <StatusPill status={statuses.get(v.cloudflare_video_uid)} />
                  </td>
                  <td className="num">
                    <Link href={`/admin/produkter/${v.id}`}>Rediger →</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
