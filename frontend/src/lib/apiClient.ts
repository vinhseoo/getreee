const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  const body = await res.json()
  if (!res.ok || !body.success) {
    throw new ApiError(res.status, body.message ?? 'Đã xảy ra lỗi không xác định.')
  }
  return body.data as T
}

/** Public fetch — no auth header. credentials: include for refresh cookie. */
export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    credentials: 'include',
  })
  return handleResponse<T>(res)
}

/** Authenticated fetch — injects Bearer token. */
export async function apiFetchAuth<T>(
  path: string,
  token: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options?.headers,
    },
    credentials: 'include',
  })
  return handleResponse<T>(res)
}

/** Multipart upload — no Content-Type header (browser sets boundary automatically). */
export async function apiFetchAuthMultipart<T>(
  path: string,
  token: string,
  formData: FormData,
  method = 'POST'
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    body: formData,
    headers: { Authorization: `Bearer ${token}` },
    credentials: 'include',
  })
  return handleResponse<T>(res)
}