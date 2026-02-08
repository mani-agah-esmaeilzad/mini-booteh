const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

export function toPersianDigits(value: number | string): string {
  return value
    .toString()
    .split("")
    .map((char) => {
      const digit = Number(char);
      if (Number.isNaN(digit)) {
        return char;
      }
      return persianDigits[digit];
    })
    .join("");
}

export function formatDate(date: Date | string): string {
  const target = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
    .format(target)
    .replace(/[0-9]/g, (d) => persianDigits[Number(d)]);
}

export function formatPercent(value: number): string {
  return `${toPersianDigits(value.toFixed(1))}٪`;
}

export function formatMilliSeconds(value: number): string {
  return `${toPersianDigits(Math.round(value).toString())}`;
}
