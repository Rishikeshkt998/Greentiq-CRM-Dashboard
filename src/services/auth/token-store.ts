let currentToken: string | null = null;

export function getAccessToken(): string | null {
  if (typeof window !== 'undefined' && !currentToken) {
    currentToken = localStorage.getItem('gt_access_token');
  }
  return currentToken;
}

export function setAccessToken(token: string | null): void {
  currentToken = token;
  if (typeof window !== 'undefined') {
    if (token) {
      localStorage.setItem('gt_access_token', token);
    } else {
      localStorage.removeItem('gt_access_token');
    }
  }
}
