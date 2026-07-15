const API = import.meta.env.VITE_API_URL || "http://localhost:8080";

export async function apiGet(path) {
  try {
    const res = await fetch(`${API}/v1${path}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function apiPost(path, body) {
  try {
    const res = await fetch(`${API}/v1${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json().catch(() => null);
    return { ok: res.ok, status: res.status, data };
  } catch {
    return { ok: false, status: 0, data: null };
  }
}
