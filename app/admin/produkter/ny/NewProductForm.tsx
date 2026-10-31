"use client";

import { useActionState, useRef, useState } from "react";
import * as tus from "tus-js-client";
import { createProductAction, discardUploadAction } from "../../actions";

type UploadState =
  | { phase: "idle" }
  | { phase: "uploading"; percent: number; fileName: string }
  | { phase: "done"; uid: string; fileName: string }
  | { phase: "error"; message: string };

const CHUNK_SIZE = 50 * 1024 * 1024; // Cloudflare: ≥5 MB and a multiple of 256 KiB

export default function NewProductForm() {
  const [state, formAction, saving] = useActionState(createProductAction, undefined);
  const [upload, setUpload] = useState<UploadState>({ phase: "idle" });
  const [manualUid, setManualUid] = useState("");
  const [useManual, setUseManual] = useState(false);
  const uploadRef = useRef<tus.Upload | null>(null);

  function startUpload(file: File) {
    let uid: string | null = null;
    setUpload({ phase: "uploading", percent: 0, fileName: file.name });

    const u = new tus.Upload(file, {
      endpoint: `${window.location.origin}/api/admin/stream-upload`,
      chunkSize: CHUNK_SIZE,
      retryDelays: [0, 3000, 5000, 10000, 20000],
      storeFingerprintForResuming: false,
      metadata: { filename: file.name, filetype: file.type },
      onAfterResponse(_req, res) {
        const id = res.getHeader("stream-media-id");
        if (id) uid = id;
      },
      onProgress(sent, total) {
        setUpload({ phase: "uploading", percent: Math.floor((sent / total) * 100), fileName: file.name });
      },
      onSuccess() {
        if (uid) setUpload({ phase: "done", uid, fileName: file.name });
        else setUpload({ phase: "error", message: "Opplastingen ble fullført, men vi fikk ikke video-ID fra Cloudflare." });
      },
      onError(error) {
        console.error(error);
        setUpload({ phase: "error", message: "Opplastingen feilet. Sjekk nettforbindelsen og prøv igjen." });
      },
    });
    uploadRef.current = u;
    u.start();
  }

  async function cancelUpload() {
    await uploadRef.current?.abort(true).catch(() => {});
    if (upload.phase === "done") await discardUploadAction(upload.uid);
    setUpload({ phase: "idle" });
  }

  const uid = useManual ? manualUid.trim() : upload.phase === "done" ? upload.uid : "";
  const canSubmit = !saving && uid.length > 0;

  return (
    <form action={formAction} className="form admin-form">
      <div className="form-field">
        <label htmlFor="title">Tittel *</label>
        <input id="title" name="title" required maxLength={200} placeholder="Kneartrose — treningsprogram" />
      </div>

      <div className="form-field">
        <label htmlFor="description">Beskrivelse</label>
        <textarea id="description" name="description" maxLength={2000} rows={5} placeholder="Hva lærer kunden, hvor lang er videoen, hvem passer den for …" />
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="priceKr">Pris (kr, inkl. mva) *</label>
          <input id="priceKr" name="priceKr" required inputMode="decimal" placeholder="299" />
        </div>
        <div className="form-field">
          <label>Tilgang</label>
          <p className="caption" style={{ margin: "12px 0 0" }}>
            6 måneder fra betaling
          </p>
        </div>
      </div>

      <div className="form-field">
        <label>Video *</label>
        {!useManual && (
          <div className="admin-upload">
            {upload.phase === "idle" && (
              <input
                type="file"
                accept="video/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) startUpload(file);
                }}
              />
            )}
            {upload.phase === "uploading" && (
              <>
                <p>
                  Laster opp <strong>{upload.fileName}</strong> … {upload.percent} %
                </p>
                <div className="admin-progress">
                  <div style={{ width: `${upload.percent}%` }} />
                </div>
                <p className="caption">Ikke lukk denne siden før opplastingen er ferdig.</p>
                <button type="button" className="admin-link-btn" onClick={cancelUpload}>
                  Avbryt
                </button>
              </>
            )}
            {upload.phase === "done" && (
              <>
                <p>
                  ✓ <strong>{upload.fileName}</strong> er lastet opp. Cloudflare gjør den klar for strømming i
                  bakgrunnen (vanligvis noen minutter).
                </p>
                <button type="button" className="admin-link-btn" onClick={cancelUpload}>
                  Bytt video
                </button>
              </>
            )}
            {upload.phase === "error" && (
              <>
                <p className="admin-error">{upload.message}</p>
                <button type="button" className="admin-link-btn" onClick={() => setUpload({ phase: "idle" })}>
                  Prøv igjen
                </button>
              </>
            )}
          </div>
        )}
        {useManual && (
          <input
            value={manualUid}
            onChange={(e) => setManualUid(e.target.value)}
            placeholder="32 tegn, f.eks. 6b9e68b07dfee8cc2d116e4c51d6a957"
          />
        )}
        <button
          type="button"
          className="admin-link-btn"
          style={{ alignSelf: "flex-start" }}
          onClick={() => setUseManual((v) => !v)}
          disabled={upload.phase === "uploading"}
        >
          {useManual ? "Last opp en fil i stedet" : "Allerede lastet opp i Cloudflare? Lim inn video-ID"}
        </button>
      </div>

      <input type="hidden" name="cloudflareVideoUid" value={uid} />

      <label className="admin-check">
        <input type="checkbox" name="active" defaultChecked /> Vis i butikken med en gang
      </label>

      {state?.error && <p className="admin-error">{state.error}</p>}

      <div className="form-actions">
        <button type="submit" className="btn btn-filled" disabled={!canSubmit}>
          {saving ? "Lagrer …" : "Lagre produkt"}
        </button>
      </div>
    </form>
  );
}
