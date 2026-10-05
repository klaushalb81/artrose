"use client";

import type { FormEvent } from "react";

export default function BookingForm() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    alert("Takk! Vi ringer deg så snart som mulig.");
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-field">
          <label htmlFor="navn">
            Navn <span className="text-accent">*</span>
          </label>
          <input type="text" id="navn" name="navn" required placeholder="Ola Nordmann" />
        </div>
        <div className="form-field">
          <label htmlFor="telefon">
            Telefon <span className="text-accent">*</span>
          </label>
          <input type="tel" id="telefon" name="telefon" required placeholder="+47 ___ __ ___" />
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="epost">E-post</label>
        <input type="email" id="epost" name="epost" placeholder="navn@epost.no" />
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="ledd">Hvilket ledd plager deg?</label>
          <select id="ledd" name="ledd" defaultValue="Velg ett alternativ">
            <option>Velg ett alternativ</option>
            <option>Kne</option>
            <option>Hofte</option>
            <option>Annet / vet ikke</option>
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="diagnose">Har du fått diagnosen artrose?</label>
          <select id="diagnose" name="diagnose" defaultValue="Velg">
            <option>Velg</option>
            <option>Ja, av lege</option>
            <option>Mistanke</option>
            <option>Nei / vet ikke</option>
          </select>
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="melding">Beskriv kort hva som plager deg</label>
        <textarea
          id="melding"
          name="melding"
          placeholder="F.eks. smerter ved trapper, stivhet om morgenen, varighet av plagene..."
        ></textarea>
      </div>

      <div className="form-field">
        <label htmlFor="tidspunkt">Når passer det best for oss å ringe?</label>
        <select id="tidspunkt" name="tidspunkt" defaultValue="Når som helst i åpningstiden">
          <option>Når som helst i åpningstiden</option>
          <option>Morgen (08–10)</option>
          <option>Formiddag (10–12)</option>
          <option>Ettermiddag (13–17)</option>
          <option>Kveld (etter 17)</option>
        </select>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-filled">
          Send forespørsel <span className="arrow">→</span>
        </button>
        <a href="tel:+4700000000" className="btn">
          Ring oss i stedet
        </a>
      </div>

      <p className="caption" style={{ marginTop: 8 }}>
        Vi behandler personopplysninger konfidensielt iht. personvernloven. Skjemaet sendes kun til
        klinikken.
      </p>
    </form>
  );
}
