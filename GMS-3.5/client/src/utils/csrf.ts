export function getCsrfToken() {
  if (typeof document === "undefined") return ""; // Handle server-side rendering safety
  const match = document.cookie.match(new RegExp('(^| )XSRF-TOKEN=([^;]+)'));
  return match ? match[2] : "";
}