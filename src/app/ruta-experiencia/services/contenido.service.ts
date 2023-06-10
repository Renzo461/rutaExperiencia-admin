import { Injectable } from '@angular/core';
import {
  Contenido,
  NuevoContenido,
  Contenidos,
} from '../Interfaces/ruta-experiencia.interface';
import { HttpClient } from '@angular/common/http';
import { catchError, of, tap } from 'rxjs';
import { API_URL } from 'src/app/api.constants';

@Injectable({
  providedIn: 'root',
})
export class ContenidoService {
  private _contenido: Contenido[] = [];
  private _contenidos: Contenidos[] = [];
  private _idExperiencia = 0;

  get contenido() {
    return this._contenido;
  }
  get contenidos() {
    return [...this._contenidos];
  }
  get idExperiencia() {
    return this._idExperiencia;
  }

  constructor(private http: HttpClient) {}
  getContenido(id: number) {
    const url = `${URL}/contenido/experiencia/${id}`;
    return this.http.get<Contenidos[]>(url).pipe(
      tap(result => {
        this._contenidos = result;
      })
    );
  }

  buscarContenido(idExperiencia: number) {
    const URL = `${API_URL}/contenido/experiencia/${idExperiencia}`;
    return this.http.get<Contenido[]>(URL).pipe(
      tap(resp => {
        this._contenido = resp;
      }),
      catchError(() => of(false))
    );
  }

  subirContenido(nuevoContenido: NuevoContenido) {
    const URL = `${API_URL}/contenido`;
    return this.http.post(URL, nuevoContenido);
  }

  editarContenido(idContenido: number, nuevoContenido: NuevoContenido) {
    const URL = `${API_URL}/contenido/${idContenido}`;
    return this.http.put(URL, nuevoContenido);
  }

  asignarExperiencia(id: number) {
    this._idExperiencia = id;
  }
}
