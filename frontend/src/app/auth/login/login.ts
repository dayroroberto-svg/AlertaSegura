import { Component, inject, signal } from '@angular/core';
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

  readonly loading = signal(false);
  readonly errorMessage = signal('');
  readonly infoMessage = signal('');
  readonly userNotFound = signal(false);
  rememberSession = true;

  submit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');
    this.infoMessage.set('');
    this.userNotFound.set(false);

    this.auth.login(this.loginForm.getRawValue(), this.rememberSession).subscribe({
      next: () => {
        this.loading.set(false);
        void this.router.navigateByUrl('/dashboard');
      },
      error: (error: { error?: { message?: string }; status?: number }) => {
        this.userNotFound.set(error.status === 404);
        this.errorMessage.set(
          error.status === 404
            ? 'El correo no está registrado. Regístrate para crear tu cuenta.'
            : error.error?.message ?? 'No se pudo iniciar sesión. Verifica tus datos.',
        );
        this.loading.set(false);
      },
    });
  }

  goToRegister(): void {
    void this.router.navigateByUrl('/registro');
  }
}
