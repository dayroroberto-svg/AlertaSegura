import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

let recordarSesion = true;

/** Elige dónde se guarda la próxima sesión: localStorage si se recuerda, sessionStorage si no. */
export function setRecordarSesion(recordar: boolean): void {
  recordarSesion = recordar;
}

const almacenamiento = {
  getItem: (clave: string) => localStorage.getItem(clave) ?? sessionStorage.getItem(clave),
  setItem: (clave: string, valor: string) => {
    const destino = recordarSesion ? localStorage : sessionStorage;
    const otro = recordarSesion ? sessionStorage : localStorage;
    otro.removeItem(clave);
    destino.setItem(clave, valor);
  },
  removeItem: (clave: string) => {
    localStorage.removeItem(clave);
    sessionStorage.removeItem(clave);
  },
};

export const supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey, {
  auth: {
    storage: almacenamiento,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});
