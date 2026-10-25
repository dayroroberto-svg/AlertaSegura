import { Injectable, inject } from '@angular/core';
import { Observable, from } from 'rxjs';
import {
  ActividadReciente,
  Alerta,
  ConfiguracionAdmin,
  EstadoAlerta,
  EstadoReporte,
  NivelRiesgo,
  NuevaAlerta,
  PinMapa,
  Reporte,
  ResumenDashboard,
  UsuarioAdmin,
} from './admin.models';
import { AuthService } from '../client/core/auth/auth.service';
import { DatosService } from '../core/data/datos.service';
import { etiquetaCategoria, nombreCategoria, textoUbicacion } from '../core/data/etiquetas';
import { supabase } from '../core/supabase/supabase.client';
import { Alerta as AlertaDb, Perfil, Reporte as ReporteDb, Ubicacion } from '../core/models';

type UbicacionTexto = Pick<Ubicacion, 'distrito' | 'provincia' | 'direccion'>;

type ReporteFila = ReporteDb & {
  categorias_emergencia: { nombre: string } | null;
  niveles_riesgo: { nombre: string } | null;
  estados_reporte: { nombre: string } | null;
  ubicaciones: (UbicacionTexto & { latitud: number | null; longitud: number | null }) | null;
  perfiles: { nombres: string; apellidos: string } | null;
};

type AlertaFila = AlertaDb & {
  categorias_emergencia: { nombre: string } | null;
  niveles_riesgo: { nombre: string } | null;
  estados_alerta: { nombre: string } | null;
  ubicaciones: (UbicacionTexto & { latitud: number | null; longitud: number | null }) | null;
};

type PerfilFila = Perfil & { roles: { nombre: string } | null };

const SELECT_REPORTE =
  '*, categorias_emergencia(nombre), niveles_riesgo(nombre), estados_reporte(nombre), ubicaciones(distrito, provincia, direccion, latitud, longitud), perfiles(nombres, apellidos)';
const SELECT_ALERTA =
  '*, categorias_emergencia(nombre), niveles_riesgo(nombre), estados_alerta(nombre), ubicaciones(distrito, provincia, direccion, latitud, longitud)';

const NIVEL_A_DB: Record<NivelRiesgo, string> = { alto: 'ALTO', medio: 'MODERADO', bajo: 'BAJO' };
const ESTADO_ALERTA_A_DB: Record<EstadoAlerta, string> = { activa: 'ACTIVA', finalizada: 'FINALIZADA', archivada: 'CANCELADA' };
const COLORES_TIPOS = ['#dc2626', '#ea580c', '#ca8a04', '#2563eb'];
const DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

const FORMATO_FECHA = new Intl.DateTimeFormat('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
const FORMATO_HORA = new Intl.DateTimeFormat('es-PE', { hour: '2-digit', minute: '2-digit', hour12: false });

// Aquí está todo el acceso a datos del panel admin. La interfaz trabaja con los
// códigos (REP-..., ALE-...) y este servicio los convierte a los ids numéricos.
@Injectable({ providedIn: 'root' })
export class AdminDataService {
  private readonly datos = inject(DatosService);
  private readonly auth = inject(AuthService);

  obtenerResumenDashboard(): Observable<ResumenDashboard> {
    return from(this.resumenDashboard());
  }

  /** Reportes que esperan revisión (pendientes o en revisión). */
  contarPendientes(): Observable<number> {
    return from(
      supabase
        .from('reportes')
        .select('id_reporte, estados_reporte!inner(nombre)')
        .in('estados_reporte.nombre', ['PENDIENTE', 'EN_REVISION'])
        .then(({ data, error }) => {
          if (error) throw error;
          return data.length;
        }),
    );
  }

  listarReportes(): Observable<Reporte[]> {
    return from(
      supabase
        .from('reportes')
        .select(SELECT_REPORTE)
        .order('fecha_reporte', { ascending: false })
        .overrideTypes<ReporteFila[]>()
        .then(({ data, error }) => {
          if (error) throw error;
          return data.filter((fila) => fila.estados_reporte?.nombre !== 'ARCHIVADO').map((fila) => this.aReporte(fila));
        }),
    );
  }

  obtenerReporte(id: string): Observable<Reporte | null> {
    return from(this.reportePorCodigo(id));
  }

  /** Enlace temporal (1 hora) para ver la foto del reporte; el bucket es privado. */
  urlEvidencia(ruta: string): Observable<string | null> {
    return from(
      supabase.storage
        .from('evidencias')
        .createSignedUrl(ruta, 3600)
        .then(({ data, error }) => (error ? null : data.signedUrl)),
    );
  }

  /** Vuelve a pedir la revisión de la foto con IA y devuelve el reporte actualizado. */
  analizarEvidencia(id: string): Observable<Reporte | null> {
    return from(
      (async () => {
        const idReporte = await this.idReporte(id);
        if (idReporte === null) return null;
        await this.datos.analizarEvidencia(idReporte);
        return this.reportePorCodigo(id);
      })(),
    );
  }

  verificarReporte(id: string, comentario?: string): Observable<Reporte | null> {
    return from(this.resolverReporte(id, 'VERIFICADO', comentario));
  }

  rechazarReporte(id: string, comentario?: string): Observable<Reporte | null> {
    return from(this.resolverReporte(id, 'RECHAZADO', comentario?.trim() || 'Sin comentarios del administrador'));
  }

  listarAlertas(): Observable<Alerta[]> {
    return from(
      supabase
        .from('alertas')
        .select(SELECT_ALERTA)
        .order('fecha_publicacion', { ascending: false })
        .overrideTypes<AlertaFila[]>()
        .then(({ data, error }) => {
          if (error) throw error;
          return data.map((fila) => this.aAlerta(fila));
        }),
    );
  }

  obtenerAlerta(id: string): Observable<Alerta | null> {
    return from(this.alertaPorCodigo(id));
  }

  crearAlerta(datos: NuevaAlerta): Observable<Alerta> {
    return from(this.publicarAlerta(datos));
  }

  cambiarEstadoAlerta(id: string, estado: EstadoAlerta): Observable<Alerta | null> {
    return this.actualizarAlerta(id, { estado });
  }

  actualizarAlerta(id: string, cambios: Partial<Pick<Alerta, 'titulo' | 'estado'>>): Observable<Alerta | null> {
    return from(this.modificarAlerta(id, cambios));
  }

  listarUsuarios(): Observable<UsuarioAdmin[]> {
    return from(this.usuarios());
  }

  cambiarEstadoUsuario(id: string, activo: boolean): Observable<UsuarioAdmin | null> {
    return from(
      Promise.resolve(supabase.rpc('cambiar_estado_usuario', { p_id_usuario: Number(id), p_estado: activo ? 'ACTIVO' : 'INACTIVO' })).then(
        async ({ error }) => {
          if (error) throw error;
          return (await this.usuarios()).find((usuario) => usuario.id === id) ?? null;
        },
      ),
    );
  }

  listarPinesMapa(): Observable<PinMapa[]> {
    return from(this.pinesMapa());
  }

  obtenerConfiguracion(): Observable<ConfiguracionAdmin> {
    return from(this.configuracion());
  }

  guardarNotificaciones(estados: boolean[]): Observable<void> {
    const sesion = this.auth.session();
    if (!sesion) throw new Error('Sesión no válida');
    return from(
      Promise.resolve(supabase.from('perfiles').update({ preferencias: { notificaciones: estados } }).eq('id_usuario', sesion.idUsuario)).then(
        ({ error }) => {
          if (error) throw error;
        },
      ),
    );
  }

  private async reportePorCodigo(codigo: string): Promise<Reporte | null> {
    const { data, error } = await supabase
      .from('reportes')
      .select(SELECT_REPORTE)
      .eq('codigo_reporte', codigo)
      .maybeSingle();
    if (error) throw error;
    return data ? this.aReporte(data as unknown as ReporteFila) : null;
  }

  private async resolverReporte(codigo: string, resultado: 'VERIFICADO' | 'RECHAZADO', comentario?: string): Promise<Reporte | null> {
    const idReporte = await this.idReporte(codigo);
    if (idReporte === null) return null;
    const { error } = await supabase.rpc('verificar_reporte', {
      p_id_reporte: idReporte,
      p_resultado: resultado,
      p_comentarios: comentario?.trim() || null,
    });
    if (error) throw error;
    return this.reportePorCodigo(codigo);
  }

  private async idReporte(codigo: string): Promise<number | null> {
    const { data, error } = await supabase.from('reportes').select('id_reporte').eq('codigo_reporte', codigo).maybeSingle();
    if (error) throw error;
    return data?.id_reporte ?? null;
  }

  private aReporte(fila: ReporteFila): Reporte {
    const fecha = new Date(fila.fecha_incidente ?? fila.fecha_reporte);
    return {
      id: fila.codigo_reporte,
      tipo: etiquetaCategoria(fila.categorias_emergencia?.nombre ?? 'OTROS'),
      ubicacion: textoUbicacion(fila.ubicaciones),
      fecha: FORMATO_FECHA.format(fecha),
      hora: FORMATO_HORA.format(fecha),
      gravedad: this.aNivel(fila.niveles_riesgo?.nombre),
      estado: this.aEstadoReporte(fila.estados_reporte?.nombre),
      descripcion: fila.descripcion ?? fila.titulo,
      ciudadano: fila.perfiles ? `${fila.perfiles.nombres} ${fila.perfiles.apellidos}` : 'Ciudadano',
      latitud: fila.ubicaciones?.latitud != null ? Number(fila.ubicaciones.latitud) : null,
      longitud: fila.ubicaciones?.longitud != null ? Number(fila.ubicaciones.longitud) : null,
      evidencia: fila.evidencia_url,
      ia: fila.ia_veredicto
        ? {
            veredicto: fila.ia_veredicto,
            confianza: fila.ia_confianza != null ? Number(fila.ia_confianza) : null,
            motivo: fila.ia_motivo ?? '',
          }
        : null,
    };
  }

  private aEstadoReporte(nombre?: string): EstadoReporte {
    return nombre === 'VERIFICADO' ? 'verificado' : nombre === 'RECHAZADO' ? 'rechazado' : 'revision';
  }

  private async alertaPorCodigo(codigo: string): Promise<Alerta | null> {
    const { data, error } = await supabase
      .from('alertas')
      .select(SELECT_ALERTA)
      .eq('codigo_alerta', codigo)
      .maybeSingle();
    if (error) throw error;
    return data ? this.aAlerta(data as unknown as AlertaFila) : null;
  }

  private async publicarAlerta(datos: NuevaAlerta): Promise<Alerta> {
    const [categorias, niveles] = await Promise.all([this.datos.categorias(), this.datos.niveles()]);
    const categoria = categorias.find((c) => c.nombre === nombreCategoria(datos.tipo));
    const nivel = niveles.find((n) => n.nombre === NIVEL_A_DB[datos.nivel]);
    if (!categoria || !nivel) throw new Error('Tipo de emergencia o nivel de riesgo inválido');

    const idReporte = datos.idReporte ? await this.idReporte(datos.idReporte) : null;
    const { data, error } = idReporte
      ? await supabase
          .rpc('crear_alerta_desde_reporte', {
            p_id_reporte: idReporte,
            p_titulo: datos.titulo,
            p_descripcion: datos.descripcion,
            p_recomendaciones: datos.recomendaciones,
            p_id_nivel: nivel.id_nivel,
          })
          .single<AlertaDb>()
      : await supabase
          .rpc('crear_alerta_manual', {
            p_id_categoria: categoria.id_categoria,
            p_id_nivel: nivel.id_nivel,
            p_titulo: datos.titulo,
            p_descripcion: datos.descripcion,
            p_recomendaciones: datos.recomendaciones,
            p_direccion: datos.ubicacion,
          })
          .single<AlertaDb>();
    if (error) throw error;

    const alerta = await this.alertaPorCodigo(data.codigo_alerta);
    if (!alerta) throw new Error('No se pudo leer la alerta creada');
    return alerta;
  }

  private async modificarAlerta(codigo: string, cambios: Partial<Pick<Alerta, 'titulo' | 'estado'>>): Promise<Alerta | null> {
    const { data: fila, error: errorBusqueda } = await supabase.from('alertas').select('id_alerta').eq('codigo_alerta', codigo).maybeSingle();
    if (errorBusqueda) throw errorBusqueda;
    if (!fila) return null;

    if (cambios.titulo !== undefined) {
      const { error } = await supabase.from('alertas').update({ titulo: cambios.titulo, fecha_actualizacion: new Date().toISOString() }).eq('id_alerta', fila.id_alerta);
      if (error) throw error;
    }
    if (cambios.estado !== undefined) {
      const { error } = await supabase.rpc('cambiar_estado_alerta', { p_id_alerta: fila.id_alerta, p_estado: ESTADO_ALERTA_A_DB[cambios.estado] });
      if (error) throw error;
    }
    return this.alertaPorCodigo(codigo);
  }

  private aAlerta(fila: AlertaFila): Alerta {
    const fecha = new Date(fila.fecha_publicacion);
    const estado = fila.estados_alerta?.nombre;
    return {
      id: fila.codigo_alerta,
      tipo: etiquetaCategoria(fila.categorias_emergencia?.nombre ?? 'OTROS'),
      ubicacion: textoUbicacion(fila.ubicaciones),
      nivel: this.aNivel(fila.niveles_riesgo?.nombre),
      fecha: FORMATO_FECHA.format(fecha),
      hora: FORMATO_HORA.format(fecha),
      estado: estado === 'FINALIZADA' ? 'finalizada' : estado === 'CANCELADA' ? 'archivada' : 'activa',
      titulo: fila.titulo,
    };
  }

  private aNivel(nombre?: string): NivelRiesgo {
    return nombre === 'CRITICO' || nombre === 'ALTO' ? 'alto' : nombre === 'MODERADO' ? 'medio' : 'bajo';
  }

  private async usuarios(): Promise<UsuarioAdmin[]> {
    const [perfiles, reportes] = await Promise.all([
      supabase.from('perfiles').select('*, roles!inner(nombre)').eq('roles.nombre', 'CIUDADANO').order('id_usuario').overrideTypes<PerfilFila[]>(),
      supabase.from('reportes').select('id_usuario').overrideTypes<{ id_usuario: number }[]>(),
    ]);
    if (perfiles.error) throw perfiles.error;
    if (reportes.error) throw reportes.error;

    const conteo = new Map<number, number>();
    reportes.data.forEach((r) => conteo.set(r.id_usuario, (conteo.get(r.id_usuario) ?? 0) + 1));

    return perfiles.data.map((p) => ({
      id: String(p.id_usuario),
      nombre: `${p.nombres} ${p.apellidos}`,
      email: p.correo,
      distrito: p.distrito || '—',
      registro: FORMATO_FECHA.format(new Date(p.fecha_registro)),
      activo: p.estado === 'ACTIVO',
      reportes: conteo.get(p.id_usuario) ?? 0,
    }));
  }

  private async pinesMapa(): Promise<PinMapa[]> {
    const alertas = await this.datos.alertas();
    return alertas
      .filter((a) => a.ubicaciones?.latitud != null && a.ubicaciones?.longitud != null)
      .map((a) => ({
        id: a.codigo_alerta,
        tipo: etiquetaCategoria(a.categorias_emergencia?.nombre ?? 'OTROS'),
        ubicacion: textoUbicacion(a.ubicaciones),
        nivel: this.aNivel(a.niveles_riesgo?.nombre),
        latitud: Number(a.ubicaciones!.latitud),
        longitud: Number(a.ubicaciones!.longitud),
        desc: a.titulo,
      }));
  }

  private async configuracion(): Promise<ConfiguracionAdmin> {
    const sesion = this.auth.session();
    const [categorias, perfil] = await Promise.all([
      this.datos.categorias(),
      sesion
        ? supabase.from('perfiles').select('telefono, preferencias').eq('id_usuario', sesion.idUsuario).maybeSingle()
        : Promise.resolve({ data: null, error: null }),
    ]);
    if (perfil.error) throw perfil.error;

    return {
      perfil: {
        nombre: sesion ? `${sesion.nombres} ${sesion.apellidos}` : 'Administrador',
        cargo: 'Administrador',
        telefono: perfil.data?.telefono ?? '—',
        organizacion: 'AlertaSegura',
        correo: sesion?.correo ?? '',
        rol: sesion?.rol ?? 'ADMINISTRADOR',
      },
      notificaciones: [
        { label: 'Nuevo reporte ciudadano', desc: 'Recibir notificación cuando se envíe un nuevo reporte', on: true },
        { label: 'Reporte de nivel alto', desc: 'Notificaciones inmediatas para reportes críticos', on: true },
        { label: 'Alerta publicada', desc: 'Confirmar cuando una alerta se publica exitosamente', on: true },
        { label: 'Resumen diario', desc: 'Resumen de actividad al inicio de cada jornada', on: false },
        { label: 'Notificaciones por correo', desc: 'Recibir también notificaciones vía correo electrónico', on: false },
      ].map((n, i) => ({ ...n, on: perfil.data?.preferencias?.notificaciones?.[i] ?? n.on })),
      categorias: categorias.filter((c) => c.estado === 'ACTIVO').map((c) => etiquetaCategoria(c.nombre)),
      sistema: [
        { label: 'Nombre de la plataforma', val: 'AlertaSegura' },
        { label: 'Organización responsable', val: 'INDECI — Instituto Nacional de Defensa Civil' },
        { label: 'Correo de soporte', val: 'soporte@alertasegura.pe' },
        { label: 'Teléfono de emergencias', val: '911' },
      ],
    };
  }

  private async resumenDashboard(): Promise<ResumenDashboard> {
    const ahora = new Date();
    const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1).toISOString();
    const inicioHoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());

    const [reportes, alertas, usuarios, usuariosMes, auditoria] = await Promise.all([
      supabase
        .from('reportes')
        .select('fecha_reporte, estados_reporte(nombre), categorias_emergencia(nombre)')
        .overrideTypes<{ fecha_reporte: string; estados_reporte: { nombre: string } | null; categorias_emergencia: { nombre: string } | null }[]>(),
      supabase
        .from('alertas')
        .select('estados_alerta(nombre), niveles_riesgo(nombre)')
        .overrideTypes<{ estados_alerta: { nombre: string } | null; niveles_riesgo: { nombre: string } | null }[]>(),
      supabase.from('perfiles').select('id_usuario', { count: 'exact', head: true }),
      supabase.from('perfiles').select('id_usuario', { count: 'exact', head: true }).gte('fecha_registro', inicioMes),
      supabase
        .from('auditoria')
        .select('accion, descripcion, fecha_accion')
        .order('fecha_accion', { ascending: false })
        .limit(6),
    ]);
    for (const resultado of [reportes, alertas, usuarios, usuariosMes, auditoria]) {
      if (resultado.error) throw resultado.error;
    }

    const filasReportes = reportes.data ?? [];
    const filasAlertas = alertas.data ?? [];
    const pendientes = filasReportes.filter((r) => ['PENDIENTE', 'EN_REVISION'].includes(r.estados_reporte?.nombre ?? ''));
    const pendientesHoy = pendientes.filter((r) => new Date(r.fecha_reporte) >= inicioHoy).length;
    const verificados = filasReportes.filter((r) => r.estados_reporte?.nombre === 'VERIFICADO').length;
    const hace7Dias = new Date(ahora.getTime() - 7 * 24 * 3600 * 1000);
    const verificadosSemana = filasReportes.filter((r) => r.estados_reporte?.nombre === 'VERIFICADO' && new Date(r.fecha_reporte) >= hace7Dias).length;
    const activas = filasAlertas.filter((a) => a.estados_alerta?.nombre === 'ACTIVA');
    const criticas = activas.filter((a) => ['ALTO', 'CRITICO'].includes(a.niveles_riesgo?.nombre ?? '')).length;

    return {
      fecha: `${String(ahora.getDate()).padStart(2, '0')} de ${ahora.toLocaleDateString('es-PE', { month: 'long' })}, ${ahora.getFullYear()}`,
      estadisticas: [
        { label: 'Reportes pendientes', value: String(pendientes.length), change: `+${pendientesHoy} hoy`, icon: 'reports', color: '#2563eb', bg: '#eff6ff' },
        { label: 'Alertas activas', value: String(activas.length), change: `${criticas} críticas`, icon: 'alerts', color: '#dc2626', bg: '#fef2f2' },
        { label: 'Emergencias verificadas', value: String(verificados), change: `+${verificadosSemana} esta semana`, icon: 'check', color: '#16a34a', bg: '#f0fdf4' },
        { label: 'Usuarios registrados', value: String(usuarios.count ?? 0), change: `+${usuariosMes.count ?? 0} este mes`, icon: 'users', color: '#7c3aed', bg: '#f5f3ff' },
      ],
      reportesPorDia: this.reportesPorDia(filasReportes.map((r) => new Date(r.fecha_reporte)), inicioHoy),
      tiposEmergencia: this.tiposEmergencia(filasReportes.map((r) => etiquetaCategoria(r.categorias_emergencia?.nombre ?? 'OTROS'))),
      actividad: (auditoria.data ?? []).map((a) => this.aActividad(a, ahora)),
    };
  }

  private reportesPorDia(fechas: Date[], inicioHoy: Date): { dia: string; valor: number }[] {
    return Array.from({ length: 7 }, (_, i) => {
      const dia = new Date(inicioHoy);
      dia.setDate(dia.getDate() - (6 - i));
      const siguiente = new Date(dia);
      siguiente.setDate(siguiente.getDate() + 1);
      return { dia: DIAS[dia.getDay()], valor: fechas.filter((f) => f >= dia && f < siguiente).length };
    });
  }

  private tiposEmergencia(etiquetas: string[]): ResumenDashboard['tiposEmergencia'] {
    if (etiquetas.length === 0) return [];
    const conteo = new Map<string, number>();
    etiquetas.forEach((e) => conteo.set(e, (conteo.get(e) ?? 0) + 1));
    const ordenados = [...conteo.entries()].filter(([tipo]) => tipo !== 'Otro').sort((a, b) => b[1] - a[1]);
    const principales = ordenados.slice(0, 4);
    const otros = (conteo.get('Otro') ?? 0) + ordenados.slice(4).reduce((suma, [, n]) => suma + n, 0);

    const filas = principales.map(([tipo, n], i) => ({ tipo, n, color: COLORES_TIPOS[i] }));
    if (otros > 0) filas.push({ tipo: 'Otro', n: otros, color: '#64748b' });
    return filas.map((f) => ({ ...f, pct: Math.round((f.n / etiquetas.length) * 100) }));
  }

  private aActividad(fila: { accion: string; descripcion: string | null; fecha_accion: string }, ahora: Date): ActividadReciente {
    const detalle = fila.descripcion ?? '';
    const textos: Record<string, [string, ActividadReciente['type']]> = {
      CREAR_REPORTE: [`Nuevo reporte ${detalle}`, 'medio'],
      VERIFICAR_REPORTE: [`Reporte ${detalle.toLowerCase()}`, 'info'],
      ESTADO_REPORTE: [`Reporte movido a ${detalle}`, 'info'],
      CREAR_ALERTA: [`Alerta ${detalle} publicada`, 'alto'],
      ESTADO_ALERTA: [`Alerta cambió a ${detalle}`, 'info'],
      ESTADO_USUARIO: [`Usuario ${detalle.toLowerCase()}`, 'info'],
    };
    const [text, type] = textos[fila.accion] ?? [fila.accion, 'info'];
    return { time: this.haceCuanto(new Date(fila.fecha_accion), ahora), text, type };
  }

  private haceCuanto(fecha: Date, ahora: Date): string {
    const minutos = Math.max(0, Math.round((ahora.getTime() - fecha.getTime()) / 60000));
    if (minutos < 60) return `Hace ${minutos} min`;
    const horas = Math.round(minutos / 60);
    return horas < 24 ? `Hace ${horas}h` : `Hace ${Math.round(horas / 24)} d`;
  }
}
