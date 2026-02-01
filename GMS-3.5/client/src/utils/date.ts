export const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";

  // Ensure the date string is treated as UTC by appending 'Z' if missing
  // (ASP.NET sometimes sends "2023-10-25T10:00:00" without the 'Z')
  const dateValue = dateString.endsWith("Z") ? dateString : `${dateString}Z`;
  
  const date = new Date(dateValue);

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(date);
};