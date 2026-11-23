import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { BUSINESS } from "@/lib/business";

export const metadata: Metadata = {
  title: "Salgsbetingelser | Artrosefysio",
  description: "Salgsbetingelser for kjøp av videopakken hos Artrosefysio: pris, betaling, levering, angrerett og reklamasjon.",
};

const B = BUSINESS;

export default function SalgsbetingelserPage() {
  return (
    <>
      <PageHero
        crumb="Salgsbetingelser"
        eyebrow="Kjøpsvilkår"
        title="Salgsbetingelser."
        lede="Vilkårene som gjelder når du kjøper tilgang til treningsvideoene på nettsiden."
      />

      <div className="stripe"></div>

      <section>
        <div className="container">
          <div className="legal">
            <p className="legal-meta">Gjelder fra {B.legalUpdated}.</p>

            <nav className="legal-toc" aria-label="Innhold">
              <span className="label label-muted">Innhold</span>
              <ol>
                <li><a href="#avtalen">Avtalen og partene</a></li>
                <li><a href="#produktet">Hva du kjøper</a></li>
                <li><a href="#pris">Pris og betaling</a></li>
                <li><a href="#levering">Levering</a></li>
                <li><a href="#angrerett">Angrerett</a></li>
                <li><a href="#mangler">Feil og mangler (reklamasjon)</a></li>
                <li><a href="#bruk">Bruk av innholdet</a></li>
                <li><a href="#helse">Viktig om helse og trening</a></li>
                <li><a href="#personvern">Personopplysninger</a></li>
                <li><a href="#konflikt">Konfliktløsning</a></li>
                <li><a href="#angreskjema">Angreskjema</a></li>
              </ol>
            </nav>

            <h2 id="avtalen">1. Avtalen og partene</h2>
            <p>
              Disse betingelsene gjelder når du som forbruker kjøper videopakken på denne nettsiden. Avtalen består av
              disse betingelsene, opplysningene som gis i bestillingsløsningen og ordrebekreftelsen du får på e-post.
              Ved motstrid gjelder ufravikelig forbrukerlovgivning foran disse betingelsene.
            </p>
            <p>
              <strong>Selger:</strong> {B.legalName}, org.nr. {B.orgNumber}, {B.address}. E-post:{" "}
              <a href={`mailto:${B.email}`}>{B.email}</a>. Ansvarlig: {B.owner}, fysioterapeut.
            </p>
            <p>
              <strong>Kjøper:</strong> den forbrukeren som gjennomfører bestillingen.
            </p>
            <p>
              Konsultasjoner (online eller på klinikken) avtales direkte med oss og omfattes ikke av disse
              betingelsene for videopakken.
            </p>

            <h2 id="produktet">2. Hva du kjøper</h2>
            <p>
              Videopakken gir deg <strong>tilgang i 6 måneder</strong> til alle treningsvideoene som til enhver tid er
              publisert i pakken, inkludert videoer som legges til i perioden. Tilgangen gis gjennom en personlig lenke.
              Du trenger ikke brukerkonto eller passord.
            </p>
            <p>
              Tilgangsperioden starter når betalingen er gjennomført og varer i 6 måneder. Etter dette slutter lenken å
              virke, og tilgangen fornyes ikke automatisk. Det er ingen abonnement og ingen nye trekk.
            </p>

            <h2 id="pris">3. Pris og betaling</h2>
            <p>
              Prisen står på nettsiden og i bestillingsløsningen før du betaler. Prisen er oppgitt i norske kroner og
              er totalprisen: den inkluderer alle avgifter, og det kommer ingen tillegg.
            </p>
            <p>
              Du betaler med kort gjennom vår betalingsleverandør Stripe. Beløpet trekkes når du fullfører kjøpet. Vi
              ser aldri kortopplysningene dine.
            </p>

            <h2 id="levering">4. Levering</h2>
            <p>
              Tilgangen leveres med en gang betalingen er bekreftet. Du får den personlige lenken på skjermen og på
              e-post, sammen med ordrebekreftelsen. For å se videoene trenger du internett og en oppdatert nettleser på
              mobil, nettbrett eller PC.
            </p>
            <p>
              Har du ikke fått lenken innen kort tid etter betaling, sjekk søppelpost og kontakt oss på{" "}
              <a href={`mailto:${B.email}`}>{B.email}</a>, så sender vi den på nytt.
            </p>

            <h2 id="angrerett">5. Angrerett</h2>
            <p>
              Ved kjøp på nett har du normalt 14 dagers angrerett. For digitalt innhold som leveres med en gang, gjelder
              et unntak i angrerettloven § 22 bokstav n:
            </p>
            <p>
              <strong>
                Når du kjøper videopakken, ber vi deg samtykke til at tilgangen starter med en gang, og bekrefte at du
                forstår at angreretten da går tapt. Når du har gitt dette samtykket og tilgangen er levert, har du ikke
                angrerett.
              </strong>{" "}
              Samtykket gir du ved å krysse av før betaling, og det gjentas i ordrebekreftelsen du får på e-post.
            </p>
            <p>
              Hvis angreretten likevel gjelder for kjøpet ditt, for eksempel fordi samtykket ikke ble registrert, kan du
              angre innen 14 dager etter kjøpet. Gi oss beskjed på e-post, gjerne med angreskjemaet nederst på siden.
              Vi betaler da tilbake hele beløpet senest 14 dager etter at vi mottok beskjeden, med samme
              betalingsmiddel som du brukte, og stenger tilgangen.
            </p>

            <h2 id="mangler">6. Feil og mangler (reklamasjon)</h2>
            <p>
              Videoene og tilgangen skal være slik som beskrevet, og fungere gjennom hele tilgangsperioden. Dette
              følger av digitalytelsesloven. Virker ikke lenken, mangler videoer som er lovet, eller er innholdet på
              annen måte mangelfullt, må du gi oss beskjed innen rimelig tid etter at du oppdaget feilen.
            </p>
            <p>
              Vi retter feilen så raskt vi kan, for eksempel ved å sende ny lenke eller forlenge tilgangen. Lykkes vi
              ikke med det innen rimelig tid, kan du ha krav på prisavslag eller å heve kjøpet, og eventuelt
              erstatning, etter reglene i digitalytelsesloven.
            </p>

            <h2 id="bruk">7. Bruk av innholdet</h2>
            <ul>
              <li>Lenken og videoene er kun til personlig bruk. Del ikke lenken med andre.</li>
              <li>
                Videoene er beskyttet av opphavsrett. Det er ikke tillatt å laste ned, kopiere, filme av eller
                videreformidle dem.
              </li>
              <li>
                Ved klart misbruk, for eksempel at lenken publiseres offentlig, kan vi stenge lenken. Du får da en ny
                lenke for resten av perioden.
              </li>
              <li>
                Vi kan legge til, oppdatere og bytte ut videoer. Tilbudet du har kjøpt skal ikke bli vesentlig dårligere i
                tilgangsperioden din.
              </li>
            </ul>

            <h2 id="helse">8. Viktig om helse og trening</h2>
            <p>
              Videoene gir generell veiledning i trening ved artrose, og erstatter ikke en individuell undersøkelse.
              Tilpass øvelsene etter dagsformen og bruk forslagene til progresjon og regresjon. Får du økende eller
              uvanlige smerter, hevelse eller andre nye plager, avbryt treningen og kontakt fysioterapeut eller lege.
            </p>

            <h2 id="personvern">9. Personopplysninger</h2>
            <p>
              Vi behandler personopplysningene dine for å gjennomføre kjøpet og gi deg tilgang. Les mer i{" "}
              <Link href="/personvern">personvernerklæringen</Link>.
            </p>

            <h2 id="konflikt">10. Konfliktløsning</h2>
            <p>
              Ta gjerne kontakt med oss først, så finner vi som regel en løsning. Hvis vi ikke blir enige, kan du
              klage til Forbrukerrådet, som kan mekle mellom partene. Saken kan deretter bringes inn for
              Forbrukerklageutvalget. Avtalen er underlagt norsk rett.
            </p>

            <h2 id="angreskjema">11. Angreskjema</h2>
            <p>Bruk skjemaet bare hvis du har angrerett (se punkt 5). Kopier teksten inn i en e-post til oss.</p>
            <div className="legal-form">
              {`Til: ${B.legalName}, ${B.address}, ${B.email}

Jeg underretter herved om at jeg ønsker å gå fra min avtale om kjøp av følgende tjeneste:
Videopakke — 6 måneders tilgang til treningsvideoer

Bestilt den: ____________
Forbrukerens navn: ____________
Forbrukerens adresse: ____________
E-postadressen brukt ved kjøpet: ____________
Dato: ____________`}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
