"use client";

import { useActionState } from "react";
import { updateProductAction } from "../../actions";

type Props = {
  video: { id: string; title: string; description: string; active: boolean };
};

export default function EditProductForm({ video }: Props) {
  const [state, action, pending] = useActionState(updateProductAction, undefined);

  return (
    <form action={action} className="form admin-form">
      <input type="hidden" name="id" value={video.id} />
      <div className="form-field">
        <label htmlFor="title">Tittel *</label>
        <input id="title" name="title" required maxLength={200} defaultValue={video.title} />
      </div>
      <div className="form-field">
        <label htmlFor="description">Beskrivelse</label>
        <textarea id="description" name="description" maxLength={2000} rows={6} defaultValue={video.description} />
      </div>
      <label className="admin-check">
        <input type="checkbox" name="active" defaultChecked={video.active} /> Synlig for kundene
      </label>
      {state?.error && <p className="admin-error">{state.error}</p>}
      {state?.ok && <p className="admin-ok">{state.ok}</p>}
      <div className="form-actions">
        <button type="submit" className="btn btn-filled" disabled={pending}>
          {pending ? "Lagrer …" : "Lagre endringer"}
        </button>
      </div>
    </form>
  );
}
