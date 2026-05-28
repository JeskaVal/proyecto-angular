import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DenunciaService } from '../../services/denuncia.service';
import { Denuncia } from '../../models/denuncia.model';

@Component({
    selector: 'app-consultar-denuncia',
    templateUrl: './consultar-denuncia.component.html',
    styleUrls: ['./consultar-denuncia.component.scss']
})
export class ConsultarDenunciaComponent implements OnInit {
    formularioBusqueda!: FormGroup;
    denuncia: Denuncia | null = null;
    cargando = false;
    buscando = false;
    mostrarBitacora = false;
    mostrarArchivos = false;
    bitacora: any[] = [];
    archivos: any[] = [];
    errorMensaje: string | null = null;

    estados = [
        { value: 'recibida', label: 'Recibida', color: 'azul' },
        { value: 'en_revision', label: 'En Revisión', color: 'naranja'},
        { value: 'en_proceso', label: 'En Proceso', color: 'amarillo'},
        { value: 'resuelta', label: 'Resuelta', color: 'verde'},
        { value: 'archivada', label: 'Archivada', color: 'gris'},
    ];

    constructor(
        private fb: FormBuilder,
        private denunciaService: DenunciaService
    ) {}

    ngOnInit(): void {
        this.inicializarFormulario();
    }

    inicializarFormulario(): void {
        this.formularioBusqueda = this.fb.group({
            folio: ['', Validators.required]
        });
    }

    buscarDenuncia(): void {
        if (this.formularioBusqueda.invalid) {
            this.errorMensaje = 'Por favor, ingresa un folio válido';
            return;
        }

        this.buscando = true;
        this.errorMensaje = null;
        const folio = this.formularioBusqueda.get('folio')?.value;

        this.denunciaService.consultarPorFolio(folio).subscribe({
            next: (respuesta) => {
                this.denuncia = respuesta.data;
                this.cargarBitacora();
                this.cargarArchivos();
                this.buscando = false;
            },
            error: (error) => {
                this.buscando = false;
                this.errorMensaje = 'No se encontró denuncia con ese folio';
                this.denuncia = null;
            }
        });
    }

    cargarBitacora(): void {
        if (!this.denuncia) return;
        
        this.cargando=true;
        this.denunciaService.obtenerBitacora(this.denuncia.folio).subscribe({
            next: (respuesta) => {
                this.bitacora = respuesta.data;
                this.cargando = false;
            },
            error: () => {
                this.cargando = false;
            }
        });
    }

    cargarArchivos(): void {
        if (!this.denuncia) return;

        this.cargando = true;
        this.denunciaService.obtenerArchivos(this.denuncia.folio).subscribe({
            next: (respuesta) => {
                this.archivos = respuesta.data;
                this.cargando = false;
            },
            error: () => {
                this.cargando = false;
            }
        });
    }

    descargarArchivos(archivo: any): void {
        this.denunciaService.descargarArchivo(archivo.id).subscribe({
            next: (blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = archivo.nombre_original;
                a.click();
                window.URL.revokeObjectURL(url);
            },
            error: () => {
                alert('Error al descargar el archivo');
            }
        });
    }

    obtenerEtiquetaEstado(estado: string): any {
        return this.estados.find(e => e.value === estado) || { label: estado, color: 'gris' };
    }

    toggleBitacora(): void {
        this.mostrarBitacora = !this.mostrarBitacora;
    }

    toggleArchivos(): void {
        this.mostrarArchivos = !this.mostrarArchivos;
    }

    obtenerTipoArchivoIcono(tipo: string): string {
        switch(tipo) {
            case 'imagen': return '🖼️';
            case 'pdf': return '📄';
            case 'documento': return '📋';
            default: return '📎';
        }
    }
}
