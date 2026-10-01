import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

function matchingPasswords(control: AbstractControl): ValidationErrors | null {
  const password = control.get('contrasena')?.value;
  const confirmation = control.get('confirmarContrasena')?.value;
  return password && confirmation && password !== confirmation ? { passwordsMismatch: true } : null;
}

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private readonly formBuilder = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly registerForm = this.formBuilder.nonNullable.group(
    {
      nombres: ['', [Validators.required, Validators.maxLength(100)]],
      apellidos: ['', [Validators.required, Validators.maxLength(100)]],
      correo: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      contrasena: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(100),
          Validators.pattern(/[0-9]/),
          Validators.pattern(/[^A-Za-z0-9]/),
        ],
      ],
      confirmarContrasena: ['', [Validators.required]],
    },
    { validators: matchingPasswords },
  );

  readonly loading = signal(false);
  readonly registered = signal(false);
  readonly errorMessage = signal('');

  submit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { confirmarContrasena, ...registration } = this.registerForm.getRawValue();
    void confirmarContrasena;
    this.loading.set(true);
    this.errorMessage.set('');

    this.auth.register(registration).subscribe({
      next: () => {
        this.loading.set(false);
        this.registered.set(true);
      },
      error: (error: { error?: { message?: string }; status?: number }) => {
        this.loading.set(false);
        const backendMessage = error.error?.message ?? '';
        this.errorMessage.set(error.status === 409 || backendMessage.toLowerCase().includes('correo ya está registrado')
          ? 'El correo ya está registrado'
          : backendMessage || 'No se pudo crear la cuenta. Inténtalo nuevamente.');
      },
    });
  }

  goToLogin(): void {
    void this.router.navigateByUrl('/login');
  }
}
