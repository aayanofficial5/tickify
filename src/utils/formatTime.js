export function formatTo12Hour(time24) {
  const [hourStr, minute] = time24.split(":");
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";

  hour = hour % 12 || 12; // convert 0 → 12 for midnight
  return `${hour.toString().padStart(2, "0")}:${minute} ${ampm}`;
}
