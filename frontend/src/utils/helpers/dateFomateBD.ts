export const formatDisplayDate = (dateString?: string | Date) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1; // months are 0-based
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};
