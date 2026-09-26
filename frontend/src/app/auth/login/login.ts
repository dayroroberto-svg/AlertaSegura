import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly formBuilder = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly loginForm = this.formBuilder.nonNullable.group({
    correo: ['', [Validators.required, Validators.email]],
    contrasena: ['', [Validators.required, Validators.minLength(6)]],
  });

  loading = false;
  errorMessage = '';
  infoMessage = '';
  rememberSession = true;

  submit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.infoMessage = '';

    this.auth.login(this.loginForm.getRawValue(), this.rememberSession).subscribe({
      next: () => {
        void this.router.navigateByUrl('/dashboard');
      },
      error: (error: { error?: { message?: string } }) => {
        this.errorMessage = error.error?.message ?? 'No se pudo iniciar sesión. Verifica tus datos.';
        this.loading = false;
      },
    });
  }

  showComingSoon(feature: string): void {
    this.infoMessage = `${feature} estará disponible en la siguiente etapa.`;
    this.errorMessage = '';
  }
}
