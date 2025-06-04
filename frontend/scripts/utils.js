export async function fetchUser() {
  const userData = sessionStorage.getItem("user");
  if (!userData) return null;
  try {
    return JSON.parse(userData);
  } catch (err) {
    console.error("Failed to parse user data:", err);
    return null;
  }
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "auth.html";
}

