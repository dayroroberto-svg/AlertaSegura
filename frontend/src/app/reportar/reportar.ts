import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../core/auth/auth.service';
import { ApiResponse } from '../core/auth/auth.models';
import { environment } from '../../environments/environment';
import { timeout, catchError, throwError } from 'rxjs';

interface ReporteForm {
  titulo: string;
  descripcion: string;
  categoria: string;
  direccion: string;
  latitud: number | null;
  longitud: number | null;
  nivelRiesgo: string;
  imagen: File | null;
}

interface ReporteCreado {
  idReporte: number;
}

@Component({
  selector: 'app-reportar',
  templateUrl: './reportar.html',
  styleUrl: './reportar.css',
  standalone: true,
  imports: [FormsModule, RouterLink],
})
export class Reportar {
  readonly auth = inject(AuthService);
  loading = false;
  success = false;
  error = false;
  locationError = false;
  evidenceError = false;
  formError = '';
  errorMessage = '';

  @ViewChild('imagenInput') private imagenInput?: ElementRef<HTMLInputElement>;

  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private previewUrl: string | null = null;

  disasterTypes = [
    'INCENDIO',
    'SISMO',
    'INUNDACION',
    'ACCIDENTE_TRANSITO',
    'DESLIZAMIENTO',
    'ROBO',
    'EMERGENCIA_MEDICA',
    'COLAPSO_ESTRUCTURAL',
    'FUGA_GAS',
    'OTROS',
  ];

  riskLevels = ['ALTO', 'MODERADO', 'BAJO'];

  private categoriaIds: Record<string, number> = {
    'INCENDIO': 1,
    'SISMO': 2,
    'INUNDACION': 3,
    'ACCIDENTE_TRANSITO': 4,
    'DESLIZAMIENTO': 5,
    'ROBO': 6,
    'EMERGENCIA_MEDICA': 7,
    'COLAPSO_ESTRUCTURAL': 8,
    'FUGA_GAS': 9,
    'OTROS': 10,
  };

  private nivelIds: Record<string, number> = {
    'BAJO': 1,
    'MODERADO': 2,
    'ALTO': 3,
    'CRITICO': 4,
  };

  form: ReporteForm = this.formularioVacio();

  hasImage = false;

  onSubmit(): void {
    this.success = false;
    this.error = false;
    this.locationError = false;
    this.evidenceError = false;
    this.formError = '';

    if (!this.form.titulo.trim()) {
      this.formError = 'El título es obligatorio.';
      return;
    }

    if (!this.form.descripcion.trim()) {
      this.formError = 'La descripción es obligatoria.';
      return;
    }

    if (!this.form.categoria) {
      this.formError = 'Selecciona una categoría.';
      return;
    }

    const idCategoria = this.categoriaIds[this.form.categoria];
    const idNivel = this.nivelIds[this.form.nivelRiesgo];
    if (!idCategoria || !idNivel) {
      this.formError = 'La categoría o el nivel de gravedad no son válidos.';
      return;
    }

    if (this.form.latitud === null || this.form.longitud === null) {
      this.locationError = true;
      return;
    }

    this.loading = true;
    const imagen = this.form.imagen;

    const payload = {
      titulo: this.form.titulo.trim(),
      descripcion: this.form.descripcion.trim(),
      idCategoria,
      idNivel,
      ubicacion: {
        direccion: this.form.direccion.trim(),
        latitud: this.form.latitud,
        longitud: this.form.longitud,
      },
    };

    this.http
      .post<ApiResponse<ReporteCreado>>(`${environment.apiUrl}/reportes`, payload)
      .pipe(
        timeout(15000),
        catchError((err) => {
          if (err.name === 'TimeoutError') {
            return throwError(() => ({
              status: 0,
              statusText: 'Timeout',
              message: 'El servidor tardó demasiado en responder.',
            }));
          }
          return throwError(() => err);
        }),
      )
      .subscribe({
        next: (response) => {
          const idReporte = response.data?.idReporte;
          if (idReporte && imagen) {
            this.uploadEvidence(idReporte, imagen);
            return;
          }
          this.finishSuccess();
        },
        error: (err) => {
          this.loading = false;
          this.error = true;
          this.errorMessage = this.resolveErrorMessage(err);
        },
      });
  }

  goBack(): void {
    this.router.navigate(['/inicio']);
  }

  retry(): void {
    this.error = false;
    this.errorMessage = '';
    this.resetForm();
  }

  locateUser(): void {
    if (!navigator.geolocation) {
      this.locationError = true;
      setTimeout(() => (this.locationError = false), 3000);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this.form.latitud = pos.coords.latitude;
        this.form.longitud = pos.coords.longitude;
        this.form.direccion = 'Ubicación detectada';
        this.locationError = false;
      },
      () => {
        this.locationError = true;
        setTimeout(() => (this.locationError = false), 3000);
      },
    );
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.formError = 'Selecciona un archivo de imagen válido.';
      input.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.formError = 'La imagen no puede superar los 5 MB.';
      input.value = '';
      return;
    }

    this.revokePreview();
    this.form.imagen = file;
    this.previewUrl = URL.createObjectURL(file);
    this.hasImage = true;
    this.formError = '';
  }

  removeImage(): void {
    this.form.imagen = null;
    this.hasImage = false;
    this.revokePreview();
    if (this.imagenInput) {
      this.imagenInput.nativeElement.value = '';
    }
  }

  getImageUrl(): string {
    return this.previewUrl ?? '';
  }

  private uploadEvidence(idReporte: number, imagen: File): void {
    const formData = new FormData();
    formData.append('archivo', imagen, imagen.name);

    this.http
      .post(`${environment.apiUrl}/reportes/${idReporte}/evidencia`, formData)
      .pipe(timeout(20000))
      .subscribe({
        next: () => this.finishSuccess(),
        error: () => {
          this.evidenceError = true;
          this.finishSuccess();
        },
      });
  }

  private finishSuccess(): void {
    this.loading = false;
    this.success = true;
    this.resetForm();
    setTimeout(() => (this.success = false), 5000);
  }

  private resetForm(): void {
    this.form = this.formularioVacio();
    this.hasImage = false;
    this.revokePreview();
    if (this.imagenInput) {
      this.imagenInput.nativeElement.value = '';
    }
  }

  private formularioVacio(): ReporteForm {
    return {
      titulo: '',
      descripcion: '',
      categoria: '',
      direccion: '',
      latitud: null,
      longitud: null,
      nivelRiesgo: 'MODERADO',
      imagen: null,
    };
  }

  private revokePreview(): void {
    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
      this.previewUrl = null;
    }
  }

  private resolveErrorMessage(err: {
    status?: number;
    statusText?: string;
    message?: string;
    error?: { message?: string };
  }): string {
    if (err.status === 0) {
      return err.message || 'No se pudo conectar con el servidor. Verifica que el backend esté funcionando.';
    }
    if (err.status === 401) {
      return 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
    }
    if (err.status === 403) {
      return 'No tienes permisos para enviar reportes.';
    }
    if (err.status === 400) {
      return err.error?.message || 'Datos inválidos. Verifica la información del formulario.';
    }
    if (err.status === 500) {
      return 'Error interno del servidor. Intenta más tarde.';
    }
    return err.error?.message || `Error ${err.status ?? 0}: ${err.statusText ?? 'desconocido'}`;
  }
}
