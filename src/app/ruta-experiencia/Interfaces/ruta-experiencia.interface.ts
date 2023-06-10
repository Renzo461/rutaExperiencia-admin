export interface Experiencia {
  IdExperiencia: number;
  ExNombre: string;
  ExCicloInicio: number;
  ExCicloFin: number;
  ExFila: number;
  ExIconoUrl: string;
  IdCarrera: number;
}

export interface NuevaExperiencia {
  ExNombre: string;
  ExCicloInicio: number;
  ExCicloFin: number;
  ExFila: number;
  ExIconoUrl: string;
  IdCarrera: number;
}

export interface RetornoExperiencia {
  ok: boolean;
  msg: string;
  id?: number;
}

export interface Contenido {
  IdContenido: number;
  CoTitulo: string;
  CoDescripcion: string;
  CoUrlMedia: string;
  IdTipoMedia: number;
  IdExperiencia: number;
}

export interface NuevoContenido {
  CoTitulo: string;
  CoDescripcion: string;
  CoUrlMedia: string;
  IdTipoMedia: number;
  IdExperiencia: number;
}
export interface Contenidos {
  IdContenido: number;
  CoTitulo: string;
  CoDescripcion: string;
  CoUrlMedia: string;
  IdTipoMedia: number;
  IdExperiencia: number;
  CoEstado: number;
  ExNombre: string;
  ExCicloInicio: number;
  ExCicloFin: number;
  ExFila: number;
  ExIconoUrl: string;
  IdCarrera: number;
  ExEstado: number;
}
