const SIGNS: [month: number, day: number, name: string][] = [
  [1, 20, "Verseau"],
  [2, 19, "Poissons"],
  [3, 21, "Bélier"],
  [4, 20, "Taureau"],
  [5, 21, "Gémeaux"],
  [6, 21, "Cancer"],
  [7, 23, "Lion"],
  [8, 23, "Vierge"],
  [9, 23, "Balance"],
  [10, 23, "Scorpion"],
  [11, 22, "Sagittaire"],
  [12, 22, "Capricorne"],
];

export function zodiacFromDate(iso: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return null;
  const m = d.getUTCMonth() + 1;
  const day = d.getUTCDate();
  let sign = "Capricorne";
  for (const [sm, sd, name] of SIGNS) {
    if (m > sm || (m === sm && day >= sd)) sign = name;
  }
  return sign;
}
