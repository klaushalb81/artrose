"use client";

import { useActionState } from "react";
import { updatePackageAction } from "./actions";

type Props = { pkg: { title: string; description: string; priceKr: string } };

export default function PackageForm({ pkg }: Props) {
  const [state, action, pending] = useActionState(updatePackageAction, undefined);

  return (
    <form action={action} className="form admin-form">
      <div className="form-field">
        <label htmlFor="pkg-title">Navn på pakken *</label>
        <input id="pkg-title" name="title" required maxLength={200} defaultValue={pkg.title} />
        <span className="caption">Vises i butikken, i Stripe-kassen og på kvitteringen.</span>
      </div>
      <div className="form-field">
        <label htmlFor="pkg-description">Beskrivelse</label>
        <textarea id="pkg-description" name="description" maxLength={2000} rows={3} defaultValue={pkg.description} />
      </div>
      <div className="form-field">
        <label htmlFor="pkg-price">Pris for 6 måneders tilgang (kr) *</label>
        <input id="pkg-price" name="priceKr" required inputMode="decimal" defaultValue={pkg.priceKr} />
        <span className="caption">Endret pris gjelder bare nye kjøp.</span>
      </div>
      {state?.error && <p className="admin-error">{state.error}</p>}
      {state?.ok && <p className="admin-ok">{state.ok}</p>}
      <div className="form-actions">
        <button type="submit" className="btn btn-filled" disabled={pending}>
          {pending ? "Lagrer …" : "Lagre pakken"}
        </button>
      </div>
    </form>
  );
}
