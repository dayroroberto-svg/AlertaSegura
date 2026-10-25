import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Session } from '@supabase/supabase-js';
import { Observable, from } from 'rxjs';
import { ApiResponse, LoginRequest, RegisterRequest, UserSession } from './auth.models';
import { setRecordarSesion, supabase } from '../../../core/supabase/supabase.client';
import { NombreRol } from '../../../core/models';

interface PerfilConRol {
  id_usuario: number;
  nombres: string;
  apellidos: string;
  correo: string;
  estado: string;
  roles: { nombre: NombreRol } | null;
}

/** Error con el formato que ya leen los formularios: status y error.message. */
class AuthError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly error = { message },
  ) {
    super(message);
  }
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly router = inject(Router);
  private readonly sessionState = signal<UserSession | null>(null);

  readonly session = this.sessionState.asReadonly();

  /** Corre antes del primer ruteo para que los guards encuentren la sesión ya restaurada. */
  async init(): Promise<void> {
    supabase.auth.onAuthStateChange((evento, sesion) => {
      // Aquí no se puede llamar a Supabase: el cliente se queda bloqueado.
      if (evento === 'SIGNED_OUT') {
        this.sessionState.set(null);
      } else if (evento === 'TOKEN_REFRESHED' && sesion) {
        const actual = this.sessionState();
        if (actual) {
          this.sessionState.set({ ...actual, token: sesion.access_token });
        }
      }
    });

    const { data } = await supabase.auth.getSession();
    if (data.session) {
      try {
        this.sessionState.set(await this.cargarSesion(data.session));
      } catch {
        await supabase.auth.signOut();
        this.sessionState.set(null);
      }
    }
  }

  login(credentials: LoginRequest, remember = true): Observable<ApiResponse<UserSession>> {
    return from(this.iniciarSesion(credentials, remember));
  }

  register(data: RegisterRequest): Observable<ApiResponse<null>> {
    return from(this.crearCuenta(data));
  }

  logout(): void {
    this.sessionState.set(null);
    void supabase.auth.signOut();
    void this.router.navigateByUrl('/login');
  }

  isAuthenticated(): boolean {
    return this.sessionState() !== null;
  }

  token(): string | null {
    return this.sessionState()?.token ?? null;
  }

  private async iniciarSesion(credentials: LoginRequest, remember: boolean): Promise<ApiResponse<UserSession>> {
    setRecordarSesion(remember);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.correo,
      password: credentials.contrasena,
    });
    if (error || !data.session) {
      throw new AuthError(this.mensajeDeLogin(error?.message), error?.status ?? 401);
    }

    let sesion: UserSession;
    try {
      sesion = await this.cargarSesion(data.session);
    } catch (e) {
      await supabase.auth.signOut();
      throw e;
    }
    this.sessionState.set(sesion);
    void supabase.from('perfiles').update({ ultima_conexion: new Date().toISOString() }).eq('id_usuario', sesion.idUsuario);
    return { success: true, message: 'Sesión iniciada', data: sesion };
  }

  private async crearCuenta(data: RegisterRequest): Promise<ApiResponse<null>> {
    const { data: resultado, error } = await supabase.auth.signUp({
      email: data.correo,
      password: data.contrasena,
      options: { data: { nombres: data.nombres, apellidos: data.apellidos, telefono: data.telefono, distrito: data.distrito } },
    });
    // Si se confirma el correo por mail, un correo repetido no da error y llega sin identidades.
    if (error?.message.toLowerCase().includes('already registered') || resultado.user?.identities?.length === 0) {
      throw new AuthError('El correo ya está registrado', 409);
    }
    if (error) {
      throw new AuthError('No se pudo crear la cuenta. Inténtalo nuevamente.', error.status ?? 400);
    }
    // El alta abre sesión sola; se cierra para que el usuario entre desde el login.
    if (resultado.session) {
      await supabase.auth.signOut();
    }
    return { success: true, message: 'Cuenta creada', data: null };
  }

  private async cargarSesion(sesion: Session): Promise<UserSession> {
    const { data, error } = await supabase
      .from('perfiles')
      .select('id_usuario, nombres, apellidos, correo, estado, roles(nombre)')
      .eq('auth_id', sesion.user.id)
      .single()
      .overrideTypes<PerfilConRol>();
    if (error || !data) {
      throw new AuthError('No se encontró tu perfil de usuario', 404);
    }
    if (data.estado !== 'ACTIVO') {
      throw new AuthError('Tu cuenta está inactiva. Contacta a un administrador.', 403);
    }
    return {
      idUsuario: data.id_usuario,
      nombres: data.nombres,
      apellidos: data.apellidos,
      correo: data.correo,
      rol: data.roles?.nombre ?? 'CIUDADANO',
      token: sesion.access_token,
      tipo: 'Bearer',
    };
  }

  private mensajeDeLogin(mensaje?: string): string {
    if (mensaje?.toLowerCase().includes('email not confirmed')) {
      return 'Confirma tu correo antes de iniciar sesión.';
    }
    return 'Correo o contraseña incorrectos';
  }
}
