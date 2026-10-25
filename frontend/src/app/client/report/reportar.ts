import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../core/auth/auth.service';
import { DatosService, NuevoReporte } from '../../core/data/datos.service';

interface ReporteForm {
  tipo: string;
  descripcion: string;
  direccion: string;
  latitud: number | null;
  longitud: number | null;
  nivelRiesgo: string;
  fechaIncidente: string;
  imagen: File | null;
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
  error = false;
  locationError = false;
  locationDetected = false;
  evidenceError = false;
  needsLogin = false;
  dragging = false;
  formError = '';
  errorMessage = '';

  @ViewChild('imagenInput') private imagenInput?: ElementRef<HTMLInputElement>;

  private readonly datos = inject(DatosService);
  private readonly router = inject(Router);
  private previewUrl: string | null = null;

  // Etiqueta del prototipo -> nombre y id de la categoría en la base de datos.
  readonly tipos = [
    { etiqueta: 'Sismo', idCategoria: 2 },
    { etiqueta: 'Incendio', idCategoria: 1 },
    { etiqueta: 'Inundación', idCategoria: 3 },
    { etiqueta: 'Deslizamiento', idCategoria: 5 },
    { etiqueta: 'Accidente vial', idCategoria: 4 },
    { etiqueta: 'Explosión', idCategoria: 10 },
    { etiqueta: 'Otro', idCategoria: 10 },
  ];

  readonly niveles = [
    { valor: 'ALTO', idNivel: 3, etiqueta: '🔴 Alto — Riesgo inmediato de vida' },
    { valor: 'MODERADO', idNivel: 2, etiqueta: '🟠 Medio — Situación grave' },
    { valor: 'BAJO', idNivel: 1, etiqueta: '🟡 Bajo — Situación controlable' },
  ];

  form: ReporteForm = this.formularioVacio();

  hasImage = false;

  onSubmit(): void {
    this.error = false;
    this.locationError = false;
    this.evidenceError = false;
    this.needsLogin = false;
    this.formError = '';

    const tipo = this.tipos.find((item) => item.etiqueta === this.form.tipo);
    const nivel = this.niveles.find((item) => item.valor === this.form.nivelRiesgo);
    if (!tipo || !nivel) {
      this.formError = 'Selecciona el tipo de emergencia y el nivel de gravedad.';
      return;
    }

    if (!this.form.descripcion.trim()) {
      this.formError = 'La descripción es obligatoria.';
      return;
    }

    if (this.form.latitud === null || this.form.longitud === null) {
      this.locationError = true;
      return;
    }

    if (!this.auth.session()) {
      this.needsLogin = true;
      return;
    }

    this.loading = true;
    const imagen = this.form.imagen;
    const direccion = this.form.direccion.trim();

    void this.enviarReporte(imagen, {
      titulo: direccion ? `${tipo.etiqueta} en ${direccion}` : tipo.etiqueta,
      descripcion: this.form.descripcion.trim(),
      idCategoria: tipo.idCategoria,
      idNivel: nivel.idNivel,
      fechaIncidente: this.form.fechaIncidente || undefined,
      direccion,
      latitud: this.form.latitud,
      longitud: this.form.longitud,
    });
  }

  private async enviarReporte(imagen: File | null, reporte: NuevoReporte): Promise<void> {
    // Si la evidencia falla, el reporte se envía igual y se avisa en la confirmación.
    let evidencia: string | null = null;
    if (imagen) {
      try {
        evidencia = await this.datos.subirEvidencia(imagen);
      } catch {
        this.evidenceError = true;
      }
    }

    try {
      const creado = await this.conTiempoLimite(this.datos.crearReporte({ ...reporte, evidencia }), 15000);
      this.finishSuccess(creado.id_reporte);
    } catch (err) {
      this.loading = false;
      this.error = true;
      this.errorMessage = this.resolveErrorMessage(err as { message?: string; code?: string });
    }
  }

  private conTiempoLimite<T>(promesa: Promise<T>, ms: number): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const temporizador = setTimeout(
        () => reject({ message: 'El servidor tardó demasiado en responder.', code: 'TIMEOUT' }),
        ms,
      );
      promesa.then(
        (valor) => {
          clearTimeout(temporizador);
          resolve(valor);
        },
        (motivo) => {
          clearTimeout(temporizador);
          reject(motivo);
        },
      );
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
        this.form.direccion ||= 'Ubicación detectada';
        this.locationDetected = true;
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
    this.selectFile(input.files?.[0], input);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragging = false;
    this.selectFile(event.dataTransfer?.files?.[0]);
  }

  private selectFile(file: File | undefined, input?: HTMLInputElement): void {
    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.formError = 'Selecciona un archivo de imagen válido.';
      if (input) input.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.formError = 'La imagen no puede superar los 5 MB.';
      if (input) input.value = '';
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

  private finishSuccess(idReporte?: number): void {
    this.loading = false;
    this.resetForm();
    this.router.navigate(['/reporte-enviado'], {
      state: { reporte: { idReporte, evidenciaFallida: this.evidenceError, fechaEnvio: new Date().toISOString() } },
    });
  }

  private resetForm(): void {
    this.form = this.formularioVacio();
    this.hasImage = false;
    this.locationDetected = false;
    this.revokePreview();
    if (this.imagenInput) {
      this.imagenInput.nativeElement.value = '';
    }
  }

  private formularioVacio(): ReporteForm {
    return {
      tipo: '',
      descripcion: '',
      direccion: '',
      latitud: null,
      longitud: null,
      nivelRiesgo: '',
      fechaIncidente: '',
      imagen: null,
    };
  }

  private revokePreview(): void {
    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
      this.previewUrl = null;
    }
  }

  private resolveErrorMessage(err: { message?: string; code?: string }): string {
    if (err.code === 'TIMEOUT') {
      return err.message || 'El servidor tardó demasiado en responder.';
    }
    if (err.code === '42501' || err.code === 'PGRST301') {
      return 'Tu sesión ha expirado o no tienes permisos. Inicia sesión nuevamente.';
    }
    if (err.code === '22023') {
      return err.message || 'Datos inválidos. Verifica la información del formulario.';
    }
    return err.message || 'No se pudo enviar el reporte. Intenta más tarde.';
  }
}
