export function decodeJwtPayload<T extends object>(token: string): T | null {
  if (!token || token.split('.').length < 2) {
    return null;
  }

  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '='));
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}
