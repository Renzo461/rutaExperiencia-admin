import { Injectable } from '@angular/core';
import { ExperienciaService } from './experiencia.service';
import { ContenidoService } from './contenido.service';
import {
  NuevaExperiencia,
  NuevoContenido,
} from '../Interfaces/ruta-experiencia.interface';
import { ToastrService } from 'ngx-toastr';
import { ModalService } from './modal.service';

@Injectable({
  providedIn: 'root',
})
export class RegistroService {
  private _nuevaExperiencia!: NuevaExperiencia;
  private _nuevoContenido!: NuevoContenido;

  get nuevaExperiencia() {
    return this._nuevaExperiencia;
  }

  get nuevoContenido() {
    return this._nuevoContenido;
  }

  constructor(
    private experienciaService: ExperienciaService,
    private contenidoService: ContenidoService,
    private toastr: ToastrService,
    private modalService: ModalService
  ) {}

  registrarExperienciaYContenido() {
    this.experienciaService.subirExperiencia(this._nuevaExperiencia).subscribe({
      next: (idExperienciaRegistrada) => {
        this._nuevoContenido.IdExperiencia = idExperienciaRegistrada;
        this.contenidoService.subirContenido(this._nuevoContenido).subscribe({
          next: () => {
            this.toastr.success('Contenido registrado exitosamente.');
            this.experienciaService.buscarExperiencias().subscribe();
            this.modalService.cerrarFormularioExperiencia();
          },
          error: (err) => {
            console.error(err);
            this.toastr.error(
              'Ha ocurrido un error al registrar el contenido.'
            );
          },
        });
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Ha ocurrido un error al registrar la experiencia.');
      },
    });
  }

  asignarExperiencia(arg: NuevaExperiencia) {
    this._nuevaExperiencia = arg;
  }

  asignarCotnenido(arg: NuevoContenido) {
    this._nuevoContenido = arg;
  }
}
