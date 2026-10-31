/** "8. januar 2027" — used wherever we tell the customer how long the link works. */
export function formatDateNb(date: Date): string {
  return new Intl.DateTimeFormat("nb-NO", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Oslo",
  }).format(date);
}
