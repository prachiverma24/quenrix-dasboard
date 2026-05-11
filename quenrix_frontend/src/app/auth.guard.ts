import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('access_token');

    // No token at all — user is definitely not logged in.
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    // Token exists — now check if it is expired.
    // A JWT has 3 parts separated by dots: header.payload.signature
    // The payload is Base64-encoded JSON that contains an 'exp' field (expiry timestamp).
    if (this.isTokenExpired(token)) {
      // Token exists but is expired.
      // The interceptor will try to refresh it on the next API call.
      // However, if the refresh token is also missing or expired, we block access here.
      const refreshToken = localStorage.getItem('refresh_token');

      if (!refreshToken || this.isTokenExpired(refreshToken)) {
        // Both access and refresh tokens are expired — full session expiry.
        // Clear storage and send to login.
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_role');
        localStorage.removeItem('STUDENT_DATA');
        this.router.navigate(['/login']);
        return false;
      }

      // Refresh token is still valid.
      // Allow the route to load — the interceptor will automatically
      // get a new access token when the first API call is made.
      return true;
    }

    // Token exists and is not expired — allow access.
    return true;
  }

  // Decodes the JWT payload and checks if the 'exp' timestamp has passed.
  // Returns true if the token IS expired or if it cannot be decoded.
  private isTokenExpired(token: string): boolean {
    try {
      // JWT payload is the second segment, Base64Url encoded.
      const payloadBase64 = token.split('.')[1];

      if (!payloadBase64) {
        // Token is malformed — treat as expired.
        return true;
      }

      // Base64Url uses '-' and '_' instead of '+' and '/'.
      // Replace them back to standard Base64 before decoding.
      const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
      const decodedPayload = JSON.parse(atob(base64));

      if (!decodedPayload.exp) {
        // No expiry field in token — treat as never expiring (allow access).
        return false;
      }

      // 'exp' is in seconds since epoch. Date.now() is in milliseconds.
      const currentTimeInSeconds = Math.floor(Date.now() / 1000);

      // Add a 30-second buffer to account for clock skew between
      // the client machine and the server. This prevents edge cases
      // where the token expires right as the request is being sent.
      const bufferSeconds = 30;

      return decodedPayload.exp < (currentTimeInSeconds + bufferSeconds);

    } catch (error) {
      // If decoding fails for any reason, treat the token as expired.
      console.error('AuthGuard: Failed to decode token.', error);
      return true;
    }
  }
}
