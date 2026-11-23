import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { BUSINESS } from "@/lib/business";

export const metadata: Metadata = {
  title: "Personvernerklæring | Artrosefysio",
  description: "Hvordan Artrosefysio behandler personopplysninger og bruker informasjonskapsler.",
};

const B = BUSINESS;

export default function PersonvernPage() {
  return (
    <>
      <PageHero
        crumb="Personvern"
        eyebrow="Personvern"
        title={<>Personvern&shy;erklæring.</>}
        lede="Hvilke opplysninger vi behandler, hvorfor, hvem som hjelper oss, og hvilke rettigheter du har."
      />

      <div className="stripe"></div>

      <section>
        <div className="container">
          <div className="legal">
            <p className="legal-meta">Sist oppdatert {B.legalUpdated}.</p>

            <nav className="legal-toc" aria-label="Innhold">
              <span className="label label-muted">Innhold</span>
              <ol>
                <li><a href="#ansvarlig">Behandlingsansvarlig</a></li>
                <li><a href="#opplysninger">Hvilke opplysninger, hvorfor og grunnlaget</a></li>
                <li><a href="#leverandorer">Hvem som behandler opplysninger for oss</a></li>
                <li><a href="#lagring">Hvor lenge vi lagrer</a></li>
                <li><a href="#sikkerhet">Sikkerhet</a></li>
                <li><a href="#rettigheter">Dine rettigheter</a></li>
                <li><a href="#informasjonskapsler">Informasjonskapsler (cookies)</a></li>
              </ol>
            </nav>

            <h2 id="ansvarlig">1. Behandlingsansvarlig</h2>
            <p>
              {B.legalName} (org.nr. {B.orgNumber}), {B.address}, ved {B.owner}, er ansvarlig for behandlingen av
              personopplysninger på denne nettsiden. Spørsmål om personvern sender du til{" "}
              <a href={`mailto:${B.email}`}>{B.email}</a>.
            </p>

            <h2 id="opplysninger">2. Hvilke opplysninger, hvorfor og grunnlaget</h2>

            <h3>Kjøp av videopakken</h3>
            <p>
              Vi lagrer e-postadressen din, tidspunkt for kjøpet, beløp, en referanse til betalingen og hvor lenge
              tilgangen varer. Den personlige lenken din lagres bare i kryptert og omgjort form. Kortopplysninger
              håndteres av Stripe og kommer aldri til oss.
            </p>
            <p>
              <strong>Formål:</strong> levere tilgangen, sende lenken på e-post, kundeservice (for eksempel sende
              lenken på nytt) og regnskap. <strong>Grunnlag:</strong> avtalen med deg (personvernforordningen artikkel
              6 nr. 1 bokstav b) og plikten til å oppbevare regnskapsopplysninger (artikkel 6 nr. 1 bokstav c,
              bokføringsloven).
            </p>

            <h3>Kontaktskjemaet («Bestill time»)</h3>
            <p>
              Vi mottar navn, telefonnummer, e-post (valgfritt), hvilket ledd som plager deg, om du har fått diagnosen
              artrose, din beskrivelse av plagene og når det passer å ringe. Noen av disse er{" "}
              <strong>helseopplysninger</strong>.
            </p>
            <p>
              <strong>Formål:</strong> kontakte deg for å avtale time. <strong>Grunnlag:</strong> ditt uttrykkelige
              samtykke, som du gir ved å krysse av i skjemaet (artikkel 6 nr. 1 bokstav a og artikkel 9 nr. 2 bokstav
              a). Du kan når som helst trekke samtykket ved å sende oss en e-post. Vi sletter da opplysningene. Skriv
              helst ikke mer om helsen din enn det som trengs for å avtale time.
            </p>
            <p>
              Blir du pasient, føres journal etter helselovgivningen. Det er en egen behandling som du får informasjon
              om ved første time.
            </p>

            <h3>Videoavspilling og drift av nettsiden</h3>
            <p>
              Når du besøker nettsiden eller ser videoene, behandles tekniske opplysninger som IP-adresse,
              nettlesertype og tidspunkt av driftsleverandørene våre, slik at sidene og videoene kan leveres og
              beskyttes mot misbruk. <strong>Grunnlag:</strong> vår berettigede interesse i en sikker og fungerende
              nettside (artikkel 6 nr. 1 bokstav f). Vi bruker ikke analyseverktøy eller annonsesporing.
            </p>

            <h2 id="leverandorer">3. Hvem som behandler opplysninger for oss</h2>
            <p>
              Vi selger aldri personopplysninger. Disse leverandørene behandler opplysninger på våre vegne
              (databehandlere), etter avtale med oss:
            </p>
            <table>
              <thead>
                <tr>
                  <th>Leverandør</th>
                  <th>Hva de gjør</th>
                  <th>Hvor</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Netlify</td>
                  <td>Drift av nettsiden, mottak av kontaktskjema, tekniske logger</td>
                  <td>USA</td>
                </tr>
                <tr>
                  <td>Supabase</td>
                  <td>Database for kjøp og tilganger</td>
                  <td>EU (Sverige)</td>
                </tr>
                <tr>
                  <td>Stripe</td>
                  <td>Betaling med kort</td>
                  <td>EU/USA</td>
                </tr>
                <tr>
                  <td>Cloudflare</td>
                  <td>Lagring og avspilling av videoene</td>
                  <td>Globalt / USA</td>
                </tr>
                <tr>
                  <td>Google (Gmail)</td>
                  <td>E-post med lenke og svar på henvendelser</td>
                  <td>USA</td>
                </tr>
              </tbody>
            </table>
            <p>
              Stripe er i tillegg selvstendig ansvarlig for enkelte behandlinger, for eksempel for å hindre svindel og
              oppfylle krav fra finansmyndighetene. Når opplysninger overføres til land utenfor EU/EØS, skjer det på
              grunnlag av EU-kommisjonens standard personvernbestemmelser eller en beslutning om tilstrekkelig
              beskyttelsesnivå for leverandører som er sertifisert under EU–USA-rammeverket for personvern.
            </p>

            <h2 id="lagring">4. Hvor lenge vi lagrer</h2>
            <ul>
              <li>
                <strong>Kjøp:</strong> så lenge tilgangen varer, og deretter så lenge bokføringsloven krever det
                (normalt fem år etter utgangen av regnskapsåret).
              </li>
              <li>
                <strong>Kontaktskjema:</strong> slettes senest seks måneder etter at vi har vært i kontakt med deg, eller
                tidligere hvis du ber om det.
              </li>
              <li>
                <strong>E-post:</strong> slettes når saken er avsluttet og vi ikke lenger trenger den.
              </li>
              <li>
                <strong>Tekniske logger:</strong> slettes automatisk etter kort tid hos driftsleverandørene.
              </li>
            </ul>

            <h2 id="sikkerhet">5. Sikkerhet</h2>
            <p>
              All trafikk til nettsiden er kryptert. Databasen er ikke tilgjengelig fra internett uten innlogging,
              videoene kan bare spilles av med tidsbegrensede, signerte nøkler, og den personlige lenken din lagres ikke
              i klartekst.
            </p>

            <h2 id="rettigheter">6. Dine rettigheter</h2>
            <p>Du har rett til å:</p>
            <ul>
              <li>få vite hvilke opplysninger vi har om deg (innsyn), og få en kopi</li>
              <li>få rettet uriktige opplysninger</li>
              <li>få slettet opplysninger, når vi ikke lenger har plikt eller grunnlag for å lagre dem</li>
              <li>be om at behandlingen begrenses, og protestere mot behandling basert på berettiget interesse</li>
              <li>få utlevert opplysninger du har gitt oss, i et maskinlesbart format (dataportabilitet)</li>
              <li>trekke tilbake samtykke når som helst</li>
            </ul>
            <p>
              Send forespørselen til <a href={`mailto:${B.email}`}>{B.email}</a>. Vi svarer så raskt som mulig, og
              senest innen en måned. Mener du at vi behandler opplysningene dine i strid med regelverket, kan du klage
              til Datatilsynet (datatilsynet.no).
            </p>

            <h2 id="informasjonskapsler">7. Informasjonskapsler (cookies)</h2>
            <p>
              Vi bruker <strong>ingen</strong> informasjonskapsler til analyse, statistikk eller markedsføring, og
              derfor ingen samtykkebanner. Nettsiden bruker bare det som er strengt nødvendig for at tjenestene du ber
              om skal virke:
            </p>
            <ul>
              <li>
                <strong>Betaling:</strong> Stripe setter informasjonskapsler på sin betalingsside for sikker betaling og
                for å hindre svindel.
              </li>
              <li>
                <strong>Videoavspilling:</strong> videospilleren fra Cloudflare kan lagre tekniske innstillinger i
                nettleseren for at avspillingen skal fungere.
              </li>
              <li>
                <strong>Innlogging for administrator:</strong> en innloggingskapsel som bare brukes av nettsidens eier.
              </li>
            </ul>
            <p>
              Slike strengt nødvendige informasjonskapsler krever ikke samtykke etter ekomloven. Du kan likevel slette
              eller blokkere dem i nettleseren din, men da kan betaling eller avspilling slutte å virke.
            </p>

            <p style={{ marginTop: 48 }}>
              Se også <Link href="/salgsbetingelser">salgsbetingelsene</Link>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
