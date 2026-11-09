"use client";

import { useState, type FormEvent } from "react";

/**
 * Contact / booking request form.
 *
 * Submissions go to Netlify Forms (form "bestilling", registered via
 * public/__forms.html) and are e-mailed to the clinic by a Netlify
 * "Submission notification". Only works on Netlify, not in `next dev`.
 */
export default function BookingForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    const data = new FormData(event.currentTarget);
    try {
      const response = await fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(data as unknown as Record<string, string>).toString(),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      setStatus("sent");
    } catch (error) {
      console.error("[booking form] submit failed", error);
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="callout" style={{ margin: 0 }} role="status">
        <span className="label">Takk!</span>
        <p>Forespørselen din er sendt. Vi tar kontakt så snart som mulig.</p>
      </div>
    );
  }

  return (
    <form className="form" name="bestilling" onSubmit={handleSubmit}>
      <input type="hidden" name="form-name" value="bestilling" />
      {/* Spam trap: hidden from people, bots tend to fill it in. */}
      <p hidden>
        <label>
          Ikke fyll ut dette feltet: <input name="bot-field" tabIndex={-1} autoComplete="off" />
        </label>
      </p>
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
          <option>Morgen (06:30–10)</option>
          <option>Formiddag (10–12)</option>
          <option>Ettermiddag (13–17)</option>
          <option>Kveld (etter 17)</option>
        </select>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-filled" disabled={status === "sending"}>
          {status === "sending" ? (
            "Sender …"
          ) : (
            <>
              Send forespørsel <span className="arrow">→</span>
            </>
          )}
        </button>
      </div>

      {status === "error" && (
        <p className="admin-error" role="alert">
          Beklager, forespørselen kunne ikke sendes. Prøv igjen, eller send en e-post til{" "}
          <a href="mailto:artrosefys@gmail.com" style={{ textDecoration: "underline" }}>
            artrosefys@gmail.com
          </a>
          .
        </p>
      )}

      <p className="caption" style={{ marginTop: 8 }}>
        Vi behandler personopplysninger konfidensielt iht. personvernloven. Skjemaet sendes til
        artrosefys@gmail.com.
      </p>
    </form>
  );
}
