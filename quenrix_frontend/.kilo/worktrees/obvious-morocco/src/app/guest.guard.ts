import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('access_token');
    const role = localStorage.getItem('user_role');

    // If no token is present, the user is not logged in.
    // Allow them to access the login / landing page.
    if (!token) {
      return true;
    }

    // Token exists — check if it is still valid before redirecting.
    // If it is expired and cannot be refreshed, clear the storage
    // and allow access to the login page instead of redirecting to dashboard.
    if (this.isTokenExpired(token)) {
      const refreshToken = localStorage.getItem('refresh_token');

      if (!refreshToken || this.isTokenExpired(refreshToken)) {
        // Full session expiry — clean up and let user reach the login page.
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_role');
        localStorage.removeItem('STUDENT_DATA');
        return true;
      }

      // Refresh token is still valid.
      // The user is still "logged in" — redirect to their dashboard.
      // The interceptor will renew the access token on the first API call.
    }

    // Token is valid (or refresh is still valid). User is already logged in.
    // Redirect them to their correct dashboard based on their role.
    // This prevents a logged-in user from seeing the login page again.
    if (role) {
      this.redirectByRole(role);
      return false; // Block access to the login / landing page
    }

    // Token exists but role is not saved in localStorage (edge case).
    // Try to extract the role from the JWT payload directly.
    const roleFromToken = this.getRoleFromToken(token);

    if (roleFromToken) {
      // Save it for future use and redirect.
      localStorage.setItem('user_role', roleFromToken);
      this.redirectByRole(roleFromToken);
      return false;
    }

    // Token exists but no role can be determined.
    // This is an unusual state — allow access to login to re-authenticate cleanly.
    return true;
  }

  // Redirects the user to the correct dashboard based on their role string.
  private redirectByRole(role: string): void {
    switch (role.toUpperCase()) {
      case 'STUDENT':
        this.router.navigate(['/student-dashboard']);
        break;
      case 'TRAINER':
      case 'ITRAINER':
        this.router.navigate(['/trainer-dashboard']);
        break;
      case 'ADMIN':
        this.router.navigate(['/admin-panel']);
        break;
      default:
        // Unknown role — send to a safe fallback or login.
        this.router.navigate(['/login']);
        break;
    }
  }

  // Decodes the JWT payload and reads the 'role' custom claim.
  // Returns the role string or null if it cannot be read.
  private getRoleFromToken(token: string): string | null {
    try {
      const payloadBase64 = token.split('.')[1];

      if (!payloadBase64) {
        return null;
      }

      const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
      const decodedPayload = JSON.parse(atob(base64));

      // The backend sets 'role' as a custom claim in views.py:
      // refresh['role'] = user.roleid.rolename
      return decodedPayload.role || null;

    } catch (error) {
      console.error('GuestGuard: Failed to decode token for role.', error);
      return null;
    }
  }

  // Decodes the JWT payload and checks if the 'exp' timestamp has passed.
  // Returns true if the token IS expired or if it cannot be decoded.
  private isTokenExpired(token: string): boolean {
    try {
      const payloadBase64 = token.split('.')[1];

      if (!payloadBase64) {
        return true;
      }

      const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
      const decodedPayload = JSON.parse(atob(base64));

      if (!decodedPayload.exp) {
        return false;
      }

      const currentTimeInSeconds = Math.floor(Date.now() / 1000);

      // 30-second buffer for clock skew between client and server.
      const bufferSeconds = 30;

      return decodedPayload.exp < (currentTimeInSeconds + bufferSeconds);

    } catch (error) {
      console.error('GuestGuard: Failed to decode token.', error);
      return true;
    }
  }
}
