/* eslint-disable prefer-const */
// Convert 24-hour format ("14:30") → 12-hour ("02:30 PM")
export const convertTo12Hour = (time24: string): string => {
  if (!time24) return "";
  const [hour, minute] = time24.split(":").map(Number);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12.toString().padStart(2, "0")}:${minute
    .toString()
    .padStart(2, "0")} ${ampm}`;
};

// Convert stored AM/PM ("02:30 PM") → 24-hour ("14:30")
export const convertTo24Hour = (time12: string): string => {
  if (!time12) return "";
  const [time, modifier] = time12.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (modifier === "PM" && hours < 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
};
