import api, { TOKEN_KEY } from "@/lib/axios";

// POST /auth/login, then save the token so the Axios interceptor can use it
export async function login(username, password) {
  const { data } = await api.post("/auth/login", {
    username,
    password,
    expiresInMins: 60,
  });
  localStorage.setItem(TOKEN_KEY, data.accessToken);
  return data;
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
}

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function isLoggedIn() {
  return Boolean(getToken());
}