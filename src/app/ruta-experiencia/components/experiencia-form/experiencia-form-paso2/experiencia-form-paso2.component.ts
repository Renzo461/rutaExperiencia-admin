import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ContenidoService } from '../../../services/contenido.service';
import {
  Contenido,
  NuevoContenido,
} from 'src/app/ruta-experiencia/Interfaces/ruta-experiencia.interface';
import { ExperienciaService } from 'src/app/ruta-experiencia/services/experiencia.service';
import { ToastrService } from 'ngx-toastr';
import { ModalService } from '../../../services/modal.service';
import { concat } from 'rxjs';
import { tipoMedia } from 'src/app/api.constants';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-experiencia-form-paso2',
  templateUrl: './experiencia-form-paso2.component.html',
  styleUrls: ['./experiencia-form-paso2.component.css'],
})
export class ExperienciaFormPaso2Component implements OnInit, OnDestroy {
  media = tipoMedia;
  idExperiencia = 0;
  sliderDeshabilitado = false;
  opcionContenido: ('multimedia' | 'descripcion')[] = [];
  contenidoForms: FormGroup[] = [];
  abrirContenido: boolean[] = [];
  tipoSeleccionado: number[] = [];
  urlVideo: string[] = [];

  @Output() paso = new EventEmitter<number>();

  get funcion() {
    return this.modalService.funcionFormularioExperiancia;
  }

  get contenidos() {
    return this.contenidoService.contenidos;
  }

  constructor(
    private sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
    private contenidoService: ContenidoService,
    private toastr: ToastrService,
    private modalService: ModalService,
    private experienciaService: ExperienciaService
  ) {}

  ngOnInit(): void {
    this.idExperiencia = this.contenidoService.idExperiencia;
    if (this.contenidos.length > 0) {
      this.contenidos.forEach(contenido => {
        this.agregarSlide(contenido);
      });
    } else {
      this.agregarSlide();
    }
    this.abrirContenido[0] = true;
  }
  ngOnDestroy(): void {
    this.contenidoForms.forEach((formGroup: FormGroup) => {
      formGroup.reset();
    });
  }

  cambiarOpcion(index: number, nuevaOpcion: 'multimedia' | 'descripcion') {
    this.opcionContenido[index] = nuevaOpcion;
  }

  verContenido(id: number) {
    this.abrirContenido[id] = !this.abrirContenido[id];
  }

  actualizarMedia(index: number) {
    const formGroup = this.contenidoForms.at(index);
    const inputLink = formGroup?.get('linkVideo')?.value;
    this.urlVideo[index] = this.convertirAVideoCompartido(inputLink);
  }

  convertirAVideoCompartido(url: string) {
    if (!url) {
      return 'https://www.youtube.com/embed/undefined';
    }

    const queryLink = url.split('?')[1];
    if (!queryLink) {
      return 'https://www.youtube.com/embed/undefined';
    }

    const params = new URLSearchParams(queryLink);
    const videoId = params.get('v');
    if (!videoId) {
      return 'https://www.youtube.com/embed/undefined';
    }

    const videoCompartido = `https://www.youtube.com/embed/${videoId}`;
    return videoCompartido;
  }

  convertirALinkSeguro(url = 'https://www.youtube.com/embed/undefined') {
    const linkSeguro = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    return linkSeguro;
  }

  agregarSlide(contenido?: Contenido) {
    const nuevoFormGroup = this.formBuilder.group({
      idContenido: [contenido?.IdContenido || 0],
      tipo: [contenido?.IdTipoMedia || 1, Validators.required],
      linkImagen: ['', Validators.required],
      linkVideo: ['', Validators.required],
      linkImagen360: ['', Validators.required],
      titulo: [contenido?.CoTitulo || '', Validators.required],
      contenido: [contenido?.CoDescripcion || '', Validators.required],
    });

    const url = contenido?.CoUrlMedia || '';
    if (contenido?.IdTipoMedia === 1) {
      nuevoFormGroup.patchValue({ linkImagen: url });
    } else if (contenido?.IdTipoMedia === 2) {
      nuevoFormGroup.patchValue({ linkVideo: url });
      this.urlVideo.push(this.convertirAVideoCompartido(url));
    } else if (contenido?.IdTipoMedia === 3) {
      nuevoFormGroup.patchValue({ linkImagen360: url });
    }
    this.abrirContenido.push(false);
    this.opcionContenido.push('multimedia');
    this.tipoSeleccionado.push(contenido?.IdTipoMedia || 1);
    this.contenidoForms.push(nuevoFormGroup);

    if (this.contenidoForms.length >= 4) {
      this.sliderDeshabilitado = true;
    } else {
      this.sliderDeshabilitado = false;
    }
  }

  anteriorPaso() {
    this.paso.emit(1);
  }

  isFormArrayValid(): boolean {
    return (
      this.contenidoForms.length > 0 &&
      this.contenidoForms.every(form => {
        const tipo = form.get('tipo')?.value;
        if (tipo) {
          switch (tipo) {
            case 1: // Tipo imagen
              return (
                form.get('linkImagen')?.valid &&
                form.get('titulo')?.valid &&
                form.get('contenido')?.valid
              );
            case 2: // Tipo video
              return (
                form.get('linkVideo')?.valid &&
                form.get('titulo')?.valid &&
                form.get('contenido')?.valid
              );
            case 3: // Tipo imagen 360
              return (
                form.get('linkImagen360')?.valid &&
                form.get('titulo')?.valid &&
                form.get('contenido')?.valid
              );
            default:
              return false; // Tipo no válido
          }
        } else {
          return false; // Campo 'tipo' no encontrado
        }
      })
    );
  }

  guardarContenido() {
    if (this.isFormArrayValid()) {
      const contenidoObservables = this.contenidoForms.map(form => {
        const tipo = form.value.tipo;
        const tituloTitleCase = form.value.titulo;
        let urlMedia = '';
        switch (tipo) {
          case 1: // Tipo imagen
            urlMedia = form.value.linkImagen;
            break;
          case 2: // Tipo video
            urlMedia = form.value.linkVideo;
            break;
          case 3: // Tipo imagen 360
            urlMedia = form.value.linkImagen360;
            break;
        }
        const contenido: NuevoContenido = {
          CoTitulo: tituloTitleCase,
          CoDescripcion: form.value.contenido,
          CoUrlMedia: urlMedia,
          IdTipoMedia: form.value.tipo,
          IdExperiencia: this.idExperiencia,
        };

        if (form.value.idContenido === 0) {
          // Agregar nuevo contenido
          return this.contenidoService.subirContenido(contenido);
        } else {
          // Editar contenido existente
          return this.contenidoService.editarContenido(
            form.value.idContenido,
            contenido
          );
        }
      });

      concat(...contenidoObservables).subscribe({
        next: () => {
          this.toastr.success('Contenidos guardados');
          this.modalService.cerrarFormularioExperiencia();
          this.experienciaService.buscarExperiencias().subscribe();
        },
        error: () => this.toastr.error('No se pudieron guardar los contenidos'),
      });
    }
  }
}
