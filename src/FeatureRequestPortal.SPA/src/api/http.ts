// Thin fetch wrapper shared by every API module. Attaches the bearer token,
// retries once after a silent refresh on 401, and normalizes ABP's error
// envelope ({ error: { code, message, details } }) into a typed exception.

import { clearTokens, getAccessToken, refreshAccessToken } from './auth';
import type { AbpErrorResponse } from './types';

export class ApiError extends Error {
  readonly code: string | null;
  readonly status: number;

  constructor(message: string, code: string | null, status: number) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }
}

type UnauthorizedHandler = () => void;
let unauthorizedHandler: UnauthorizedHandler | null = null;

/** Registered by AuthContext so a failed refresh can reset app-level auth state. */
export function setUnauthorizedHandler(handler: UnauthorizedHandler): void {
  unauthorizedHandler = handler;
}

async function parseErrorMessage(response: Response): Promise<{ message: string; code: string | null }> {
  try {
    const data = (await response.json()) as AbpErrorResponse;
    if (data.error?.message) {
      return { message: data.error.message, code: data.error.code };
    }
  } catch {
    // Body wasn't JSON (or was empty) — fall through to the generic message.
  }
  return { message: `Request failed with status ${response.status}.`, code: null };
}

interface ApiFetchOptions {
  method?: string;
  body?: unknown;
  /** Skip attaching the Authorization header (used for anonymous-only calls). */
  skipAuth?: boolean;
}

function readCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function buildHeaders(options: ApiFetchOptions): Headers {
  const headers = new Headers({ Accept: 'application/json' });
  if (options.body !== undefined) {
    headers.set('Content-Type', 'application/json');
  }
  const token = getAccessToken();
  if (token && !options.skipAuth) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  /* We reach the backend through the dev proxy, so we share its origin and the browser
   * replays ABP's antiforgery cookie on every call. That makes ABP treat the request as
   * cookie-authenticated and demand a matching RequestVerificationToken header on any
   * unsafe verb - without it the API answers 400 before reaching the controller.
   * ABP publishes the value in a readable XSRF-TOKEN cookie for exactly this purpose. */
  const method = (options.method ?? 'GET').toUpperCase();
  if (method !== 'GET' && method !== 'HEAD') {
    const xsrf = readCookie('XSRF-TOKEN');
    if (xsrf) {
      headers.set('RequestVerificationToken', xsrf);
    }
  }

  return headers;
}

function rawFetch(path: string, options: ApiFetchOptions): Promise<Response> {
  return fetch(path, {
    method: options.method ?? 'GET',
    headers: buildHeaders(options),
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  let response = await rawFetch(path, options);

  if (response.status === 401 && !options.skipAuth) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      response = await rawFetch(path, options);
    } else {
      clearTokens();
      unauthorizedHandler?.();
      throw new ApiError('Your session has expired. Please sign in again.', null, 401);
    }
  }

  if (!response.ok) {
    const { message, code } = await parseErrorMessage(response);
    throw new ApiError(message, code, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  return (text.length > 0 ? JSON.parse(text) : undefined) as T;
}

export function apiGet<T>(path: string): Promise<T> {
  return apiFetch<T>(path);
}

export function apiPost<T>(path: string, body?: unknown): Promise<T> {
  return apiFetch<T>(path, { method: 'POST', body });
}

export function apiDelete<T>(path: string): Promise<T> {
  return apiFetch<T>(path, { method: 'DELETE' });
}
