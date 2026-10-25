import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { DatosService, EstadisticasPublicas } from '../../../core/data/datos.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
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

  private readonly estadisticas = signal<EstadisticasPublicas | null>(null);

  // Totales reales de la base de datos; muestra "—" mientras cargan
  readonly stats = computed(() => {
    const datos = this.estadisticas();
    const valor = (n: number | undefined) => (datos && n !== undefined ? n.toLocaleString('es-PE') : '—');
    return [
      { value: valor(datos?.alertas_activas), label: 'Alertas activas' },
      { value: valor(datos?.reportes_recibidos), label: 'Reportes recibidos' },
      { value: valor(datos?.distritos), label: 'Distritos con alertas' },
      { value: '24/7', label: 'Monitoreo continuo' },
    ];
  });

  constructor() {
    inject(DatosService)
      .estadisticas()
      .then((datos) => this.estadisticas.set(datos), () => undefined);
  }

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
      next: (respuesta) => {
        this.loading.set(false);
        // El administrador entra a su panel; el ciudadano, a la página de inicio
        void this.router.navigateByUrl(respuesta.data.rol === 'ADMINISTRADOR' ? '/admin' : '/inicio');
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
