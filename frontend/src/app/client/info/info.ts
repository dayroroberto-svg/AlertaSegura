import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

interface Seccion {
  titulo: string;
  parrafos: string[];
}

interface Pagina {
  titulo: string;
  subtitulo: string;
  secciones: Seccion[];
}

// Contenido de las páginas de Soporte. Cada ruta indica cuál mostrar con `data.pagina`.
const PAGINAS: Record<string, Pagina> = {
  ayuda: {
    titulo: 'Centro de ayuda',
    subtitulo: 'Respuestas a las dudas más comunes sobre AlertaSegura',
    secciones: [
      {
        titulo: 'Estoy en peligro ahora mismo, ¿qué hago?',
        parrafos: [
          'Llama primero a la línea de emergencia: 105 (Policía Nacional), 116 (Bomberos), 106 (SAMU, ambulancias) o 115 (INDECI). AlertaSegura no reemplaza a esas líneas: los reportes los revisa un administrador antes de publicarse.',
        ],
      },
      {
        titulo: '¿Cómo envío un reporte?',
        parrafos: [
          'Inicia sesión y entra a Reportar. Elige el tipo de emergencia y la gravedad, marca el lugar en el mapa o usa tu ubicación, describe lo que pasa y, si puedes, adjunta una foto.',
        ],
      },
      {
        titulo: '¿Quién revisa mi reporte?',
        parrafos: [
          'Un administrador de AlertaSegura lo verifica o lo rechaza. Si lo verifica, puede publicarlo como alerta para que lo vea toda la comunidad. Recibirás una notificación en tu panel cuando tu reporte sea revisado.',
          'Si adjuntas una foto, una herramienta de inteligencia artificial la revisa y le deja al administrador una sugerencia sobre si corresponde a la emergencia. La decisión final siempre es del administrador.',
        ],
      },
      {
        titulo: '¿Por qué mi reporte no aparece como alerta?',
        parrafos: [
          'Puede seguir en revisión, haber sido rechazado o haberse verificado sin publicarse como alerta. Puedes ver el estado de tus reportes en tu panel.',
        ],
      },
      {
        titulo: 'No puedo iniciar sesión',
        parrafos: [
          'Revisa que el correo y la contraseña estén bien escritos. Si tu cuenta fue desactivada por un administrador, no podrás entrar hasta que la reactive.',
        ],
      },
    ],
  },
  terminos: {
    titulo: 'Términos de uso',
    subtitulo: 'Reglas para usar AlertaSegura de forma responsable',
    secciones: [
      {
        titulo: 'Qué es AlertaSegura',
        parrafos: [
          'AlertaSegura es una plataforma de seguridad ciudadana desarrollada como proyecto académico. Sirve para reportar emergencias y consultar alertas verificadas. No reemplaza a las líneas oficiales de emergencia.',
        ],
      },
      {
        titulo: 'Uso responsable',
        parrafos: [
          'Reporta solo situaciones reales. Los reportes falsos, las bromas y las fotos que no corresponden a la emergencia hacen perder tiempo a quienes revisan y pueden retrasar la atención de casos reales.',
          'Un administrador puede rechazar reportes y desactivar las cuentas que se usen de forma indebida.',
        ],
      },
      {
        titulo: 'Tu cuenta',
        parrafos: [
          'Eres responsable de mantener tu contraseña en secreto y de la información que publicas con tu cuenta.',
        ],
      },
      {
        titulo: 'Información publicada',
        parrafos: [
          'Las alertas se publican a partir de reportes revisados, pero la situación puede cambiar rápido. Sigue siempre las indicaciones de las autoridades.',
        ],
      },
    ],
  },
  privacidad: {
    titulo: 'Política de privacidad',
    subtitulo: 'Qué datos guardamos y quién puede verlos',
    secciones: [
      {
        titulo: 'Datos que guardamos',
        parrafos: [
          'De tu cuenta: nombres, apellidos, correo, teléfono y, si lo indicas, tu distrito. De cada reporte: el tipo de emergencia, la descripción, la ubicación que marcas y la foto que adjuntas.',
          'Tu contraseña no se guarda en texto plano: se almacena cifrada por el servicio de autenticación.',
        ],
      },
      {
        titulo: 'Quién puede verlos',
        parrafos: [
          'Tus reportes y tus notificaciones solo los ves tú y los administradores de la plataforma. Cuando un reporte se publica como alerta, su descripción y su ubicación pasan a ser públicas, pero no tu nombre.',
        ],
      },
      {
        titulo: 'Servicios externos',
        parrafos: [
          'Los datos se guardan en Supabase. Para convertir el punto que marcas en el mapa en una dirección usamos OpenStreetMap.',
          'Las fotos de los reportes se envían a Google Gemini para revisar si corresponden a la emergencia. En el nivel gratuito de ese servicio, Google puede usar ese contenido para mejorar sus productos.',
        ],
      },
      {
        titulo: 'Tus datos',
        parrafos: ['Puedes pedir que corrijamos o eliminemos tu cuenta escribiendo al equipo del proyecto: alertasegura9@gmail.com.'],
      },
    ],
  },
  accesibilidad: {
    titulo: 'Accesibilidad',
    subtitulo: 'Cómo procuramos que todas las personas puedan usar AlertaSegura',
    secciones: [
      {
        titulo: 'Lo que ya cuidamos',
        parrafos: [
          'Las páginas se adaptan a celulares y computadoras. Los formularios tienen etiquetas, los botones muestran el foco al navegar con el teclado y las animaciones se reducen si tu dispositivo tiene activada la opción de movimiento reducido.',
        ],
      },
      {
        titulo: 'Limitaciones conocidas',
        parrafos: [
          'Los mapas necesitan el mouse o la pantalla táctil. Si no puedes usarlos, al reportar puedes escribir la dirección o usar el botón de detectar tu ubicación.',
        ],
      },
      {
        titulo: 'Cuéntanos',
        parrafos: ['Si encuentras una barrera para usar la plataforma, escríbenos a alertasegura9@gmail.com.'],
      },
    ],
  },
};

@Component({
  selector: 'app-info',
  imports: [RouterLink],
  templateUrl: './info.html',
  styleUrl: './info.css',
})
export class Info {
  private readonly ruta = inject(ActivatedRoute);
  readonly pagina = computed(() => PAGINAS[this.ruta.snapshot.data['pagina'] as string] ?? PAGINAS['ayuda']);
}
