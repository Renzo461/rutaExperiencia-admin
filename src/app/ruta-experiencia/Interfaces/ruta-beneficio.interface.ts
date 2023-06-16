export interface Beneficio {
  IdBeneficio: number;
  BeDescripcion: string;
  IdCarrera: number;
}
export interface NuevoBeneficio {
  BeDescripcion: string;
  IdCarrera: number;
}
export interface RetornoBeneficio {
  ok: boolean;
  msg: string;
  id?: number;
}
