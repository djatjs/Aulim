export const API_BASE_URL = "http://localhost:8080/api";

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string>),
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('email');
            alert("로그인이 필요하거나 세션이 만료되었습니다. 다시 로그인해주세요.");
            window.location.href = '/login?expired=true';
            return new Promise(() => { });
        }
        throw new Error("Unauthorized");
    }

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(result.message || "오류가 발생했습니다.");
    }

    return result;
}
