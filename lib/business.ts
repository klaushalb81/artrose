/**
 * Business details shown in the footer, terms of sale, privacy statement and
 * order e-mails. Norwegian law (ehandelsloven § 8, angrerettloven § 8) requires
 * name, organisation number, address and e-mail to be easy to find.
 *
 * Safe to import anywhere (no secrets).
 */
export const BUSINESS = {
  /** Brand name used in running text. */
  brand: "Artrosefysio",
  /** Registered name in Brønnøysundregistrene (enkeltpersonforetak). */
  legalName: "[fyll inn: registrert foretaksnavn]",
  /** 9 digits, shown as "123 456 789". Not MVA-registered. */
  orgNumber: "[fyll inn: org.nr]",
  /** Registered business address. */
  address: "[fyll inn: forretningsadresse]",
  owner: "Klaus Halbakken",
  email: "artrosefys@gmail.com",
  clinic: "Sterk Kropp, Teglhageveien 29, 3125 Tønsberg",
  /** Date the current terms/privacy texts took effect (shown on the pages). */
  legalUpdated: "23. november 2026",
} as const;
