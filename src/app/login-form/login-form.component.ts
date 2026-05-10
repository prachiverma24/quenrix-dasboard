import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent {
  // Login Models
  username: string = '';
  password: string = '';
  
  // Forgot Password Model
  forgotEmail: string = '';
  
  // UI States
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;
  hidePassword: boolean = true;
  
  // Toggle between Login and Forgot Password View
  isForgotPasswordMode: boolean = false;

  constructor(
    private api: ApiService, 
    private userService: UserService,
    private router: Router
  ) {}

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  toggleView() {
    this.isForgotPasswordMode = !this.isForgotPasswordMode;
    // Clear states when switching views
    this.errorMessage = '';
    this.successMessage = '';
    this.forgotEmail = '';
    this.password = '';
    this.username = '';
  }

  login() {
    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = true;
    
    // Mocking the response because the backend server is not responding.
    // This allows you to proceed to the dashboard.
    setTimeout(() => {
      this.isLoading = false;
      const authenticatedRole = 'TRAINER';
      
      localStorage.setItem('access_token', 'mock_access_token');
      localStorage.setItem('refresh_token', 'mock_refresh_token');
      localStorage.setItem('user_role', authenticatedRole);
      
      console.log('Mock Login successful:', authenticatedRole);
      
      this.router.navigate(['/trainer-dashboard']);
    }, 1000);
  }

  // ✅ New Logic: Send Request to Backend
  requestForgotPassword() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.forgotEmail) {
      this.errorMessage = 'Please enter your registered email address.';
      return;
    }
    
    // Simple email format check
    if (!this.forgotEmail.includes('@') || !this.forgotEmail.includes('.')) {
        this.errorMessage = 'Please enter a valid email address.';
        return;
    }

    this.isLoading = true;

    this.userService.forgotPassword(this.forgotEmail).subscribe(
      (res) => {
        this.isLoading = false;
        this.successMessage = 'Success! A temporary password has been sent to your Gmail.';
        // Optionally switch back to login after delay
        setTimeout(() => {
            this.isForgotPasswordMode = false;
            this.username = this.forgotEmail; // Auto-fill email for convenience
            this.forgotEmail = '';
            this.successMessage = 'Please login with the password sent to your email.';
        }, 3000);
      },
      (error) => {
        this.isLoading = false;
        console.error('Reset Failed:', error);
        this.errorMessage = error.error?.error || 'Could not reset password. Please verify your email.';
      }
    );
  }

  goBack() {
    this.router.navigate(['/landing-page']); 
  }
}