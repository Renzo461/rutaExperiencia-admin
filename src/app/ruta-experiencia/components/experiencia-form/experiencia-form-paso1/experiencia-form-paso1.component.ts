import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthService } from '../../../../auth/services/auth.service';
import { NuevaExperiencia } from 'src/app/ruta-experiencia/Interfaces/ruta-experiencia.interface';
import { ExperienciaService } from 'src/app/ruta-experiencia/services/experiencia.service';
import { ContenidoService } from '../../../services/contenido.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalService } from '../../../services/modal.service';
import { ToastrService } from 'ngx-toastr';
import { iconos } from '../../../../api.constants';

@Component({
  selector: 'app-experiencia-form-paso1',
  templateUrl: './experiencia-form-paso1.component.html',
  styleUrls: ['./experiencia-form-paso1.component.css'],
})
export class ExperienciaFormPaso1Component {
  experienciaForm: FormGroup;
  idExperiencia = 0;
  opciones = iconos;
  @Input() ciclo = 0;
  @Output() paso = new EventEmitter<number>();

  get opcionesCiclos() {
    return Array.from(
      { length: this.ciclo - this.experiencia.ExCicloInicio + 1 },
      (_, i) => this.experiencia.ExCicloInicio + i
    );
  }

  get funcion() {
    return this.modalService.funcionFormularioExperiancia;
  }

  get experiencia() {
    return this.experienciaService.experiencia;
  }

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private experienciaService: ExperienciaService,
    private contenidoService: ContenidoService,
    private modalService: ModalService,
    private toastr: ToastrService
  ) {
    this.idExperiencia = this.experiencia.IdExperiencia;
    this.experienciaForm = this.formBuilder.group({
      cicloInicio: [this.experiencia.ExCicloInicio || '', Validators.required],
      cicloFin: [this.experiencia.ExCicloFin || '', Validators.required],
      nombre: [this.experiencia.ExNombre || '',  Validators.compose([
        Validators.required,
        Validators.maxLength(30)
      ])],
      urlIcon: [
        this.experiencia.ExIconoUrl || this.opciones[0].url,
        Validators.required,
      ],
    });
  }

  actualizarExperiencia() {
    if (this.experienciaForm.valid) {
      const IdCarrera = this.authService.usuario.idCarrera;
      const fila = this.experiencia.ExFila;
      if (IdCarrera !== null && IdCarrera !== undefined) {
        const data: NuevaExperiencia = {
          ExNombre: this.experienciaForm.value.nombre,
          ExCicloInicio: this.experienciaForm.value.cicloInicio,
          ExCicloFin: this.experienciaForm.value.cicloFin,
          ExFila: fila,
          ExIconoUrl: this.experienciaForm.value.urlIcon,
          IdCarrera,
        };

        const serviceCall = !this.idExperiencia
          ? this.experienciaService.subirExperiencia(data)
          : this.experienciaService.editarExperiencia(this.idExperiencia, data);

        serviceCall.subscribe({
          next: (idExperienciaRegistrada: number) => {
            const successMessage = !this.idExperiencia
              ? 'Experiencia Registrada'
              : 'Experiencia Editada';
            this.toastr.success(successMessage);
            this.experienciaService.buscarExperiencias().subscribe();
            this.idExperiencia = idExperienciaRegistrada;
            this.siguientePaso();
          },
          error: err => {
            console.error(err);
            this.toastr.error(
              'Ha ocurrido un error al actualizar la experiencia.'
            );
          },
        });
      } else {
        this.toastr.error('La carrera no está definida.');
      }
    }
  }

  siguientePaso() {
    this.contenidoService.asignarExperiencia(this.idExperiencia);
    this.contenidoService
      .buscarContenido(this.idExperiencia)
      .subscribe(() => this.paso.emit(2));
  }
}
