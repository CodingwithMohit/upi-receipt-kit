const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Kolkata",
});

export function formatDateTime(value: string): string {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) {
    throw new Error(`Invalid date value: ${value}`);
  }
  return `${dateFormatter.format(date)} IST`;
}
