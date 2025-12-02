export function formatTime12h(time24: string | null | undefined): string {
  if (!time24) return "";
  try {
    const parts = time24.split(":");
    const hours24 = Number(parts[0]);
    const minutes = Number(parts[1]);
    if (isNaN(hours24) || isNaN(minutes)) return time24;
    const period = hours24 >= 12 ? "PM" : "AM";
    const hours12 = hours24 % 12 || 12;
    const h = String(hours12).padStart(2, "0");
    const m = String(minutes).padStart(2, "0");
    return h + ":" + m + " " + period;
  } catch {
    return time24;
  }
}

export function formatTime24h(time12: string): string {
  if (!time12) return "";
  try {
    const regex = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i;
    const match = time12.match(regex);
    if (!match) return time12;
    const hours = Number(match[1]);
    const minutes = match[2];
    const period = match[3];
    let hours24 = hours;
    if (period.toUpperCase() === "PM" && hours24 !== 12) {
      hours24 += 12;
    } else if (period.toUpperCase() === "AM" && hours24 === 12) {
      hours24 = 0;
    }
    const h = String(hours24).padStart(2, "0");
    return h + ":" + minutes;
  } catch {
    return time12;
  }
}
