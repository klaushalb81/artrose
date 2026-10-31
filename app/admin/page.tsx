import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { getStreamVideos } from "@/lib/cloudflare-api";
import { formatPrice, listAllVideosWithStats } from "@/lib/videos";
import StatusPill from "./StatusPill";

export default async function AdminHome({ searchParams }: PageProps<"/admin">) {
  await requireAdmin();
  const { slettet } = await searchParams;

  const videos = await listAllVideosWithStats();
  const statuses = await getStreamVideos(videos.map((v) => v.cloudflare_video_uid));
  const totalRevenue = videos.reduce((sum, v) => sum + v.revenue, 0);
  const totalSales = videos.reduce((sum, v) => sum + v.sales, 0);

  return (
    <>
      <div className="admin-head">
        <div>
          <h1 className="display-sm">Videoprodukter</h1>
          <p className="caption" style={{ marginTop: 8 }}>
            {videos.length} produkter · {totalSales} salg ·{" "}
            {formatPrice({ price: totalRevenue, currency: "nok" })} totalt
          </p>
        </div>
        <Link href="/admin/produkter/ny" className="btn btn-filled">
          + Nytt produkt
        </Link>
      </div>

      {slettet && <p className="admin-ok">Produktet er slettet.</p>}

      {videos.length === 0 ? (
        <div className="callout" style={{ margin: 0 }}>
          <span className="label">Ingen produkter ennå</span>
          <p>Klikk «Nytt produkt» for å laste opp den første videoen.</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Tittel</th>
                <th>Pris</th>
                <th>I butikken</th>
                <th>Video</th>
                <th className="num">Salg</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {videos.map((v) => (
                <tr key={v.id}>
                  <td>
                    <Link href={`/admin/produkter/${v.id}`} className="admin-strong">
                      {v.title}
                    </Link>
                  </td>
                  <td>{formatPrice(v)}</td>
                  <td>{v.active ? <span className="pill pill-ok">Synlig</span> : <span className="pill">Skjult</span>}</td>
                  <td>
                    <StatusPill status={statuses.get(v.cloudflare_video_uid)} />
                  </td>
                  <td className="num">{v.sales}</td>
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
