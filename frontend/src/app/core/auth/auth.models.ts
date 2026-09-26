export interface UserSession {
  idUsuario: number;
  nombres: string;
  apellidos: string;
  correo: string;
  rol: string;
  token: string;
  tipo: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface LoginRequest {
  correo: string;
  contrasena: string;
}
