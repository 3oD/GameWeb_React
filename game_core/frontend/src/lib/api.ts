export type ApiOptions = {
  token?: string | null
}

const BASE = '/api'

function authHeader(token?: string | null): Record<string, string> {
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function apiGet<T>(path: string, opts: ApiOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...authHeader(opts.token ?? getStoredToken()),
  }
  const res = await fetch(BASE + path, {
    headers,
    credentials: 'omit',
  })
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`)
  return res.json()
}

export async function apiPost<T>(path: string, body?: any, opts: ApiOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...authHeader(opts.token ?? getStoredToken()),
  }
  const res = await fetch(BASE + path, {
    method: 'POST',
    headers,
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'omit',
  })
  if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`)
  return res.json()
}

export async function apiPatch<T>(path: string, body?: any, opts: ApiOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...authHeader(opts.token ?? getStoredToken()),
  }
  const res = await fetch(BASE + path, {
    method: 'PATCH',
    headers,
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'omit',
  })
  if (!res.ok) throw new Error(`PATCH ${path} failed: ${res.status}`)
  return res.json()
}

export async function apiPut<T>(path: string, body?: any, opts: ApiOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...authHeader(opts.token ?? getStoredToken()),
  }
  const res = await fetch(BASE + path, {
    method: 'PUT',
    headers,
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'omit',
  })
  if (!res.ok) throw new Error(`PUT ${path} failed: ${res.status}`)
  return res.json()
}

const TOKEN_KEY = 'auth:token'
const USER_KEY = 'auth:user'

export function storeToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}
export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY)
}
export function storeUser<T = unknown>(user: T | null) {
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
  else localStorage.removeItem(USER_KEY)
}
export function getStoredUser<T = any>(): T | null {
  const raw = localStorage.getItem(USER_KEY)
  return raw ? (JSON.parse(raw) as T) : null
}
