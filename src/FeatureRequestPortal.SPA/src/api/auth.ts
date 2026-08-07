// Handles the OAuth2 resource-owner-password grant against ABP's /connect/token
// endpoint, and persists tokens in localStorage.

import type { TokenErrorResponse, TokenResponse } from './types';

const ACCESS_TOKEN_KEY = 'frp.access_token';
const REFRESH_TOKEN_KEY = 'frp.refresh_token';

const CLIENT_ID = 'FeatureRequestPortal_SPA';
const SCOPE = 'FeatureRequestPortal offline_access openid profile roles email';

export class AuthError extends Error {}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

function storeTokens(tokens: TokenResponse): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access_token);
  if (tokens.refresh_token) {
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh_token);
  }
}

export function clearTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

async function requestToken(body: URLSearchParams): Promise<TokenResponse> {
  const response = await fetch('/connect/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  const data = (await response.json().catch(() => null)) as TokenResponse | TokenErrorResponse | null;

  if (!response.ok || !data || 'error' in data) {
    const description = data && 'error_description' in data ? data.error_description : undefined;
    const fallback = data && 'error' in data ? data.error : `Sign-in failed (${response.status}).`;
    throw new AuthError(description ?? fallback ?? 'Sign-in failed.');
  }

  return data;
}

export async function login(username: string, password: string): Promise<TokenResponse> {
  const body = new URLSearchParams();
  body.set('grant_type', 'password');
  body.set('username', username);
  body.set('password', password);
  body.set('client_id', CLIENT_ID);
  body.set('scope', SCOPE);

  const tokens = await requestToken(body);
  storeTokens(tokens);
  return tokens;
}

/**
 * Attempts to exchange the stored refresh token for a new access token.
 * Returns null (and clears storage) if there is no refresh token or the
 * exchange fails, so callers can fall back to signing the user out.
 */
export async function refreshAccessToken(): Promise<TokenResponse | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  const body = new URLSearchParams();
  body.set('grant_type', 'refresh_token');
  body.set('refresh_token', refreshToken);
  body.set('client_id', CLIENT_ID);

  try {
    const tokens = await requestToken(body);
    storeTokens(tokens);
    return tokens;
  } catch {
    clearTokens();
    return null;
  }
}

export function logout(): void {
  clearTokens();
}
