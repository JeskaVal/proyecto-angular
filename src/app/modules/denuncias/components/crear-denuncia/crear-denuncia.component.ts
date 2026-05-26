import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DenunciaService } from '../../services/denuncia.service';
import { Denuncia, AcuseRecibo } from '../../models/denuncia.model';
import { TemplateLiteral } from '@angular/compiler';

@Component({
    selector: 'app-crear-denuncia',
    templateUrl: './crear-denuncia.component.html',
    styleUrl: './crear-denuncia.component.scss'
})

export class CrearDenunciaComponent implements OnInit {
    formulario!: FormGroup;
    cargando = false;
    enviado = false;
    esAnonimo = true;
    acuseRecibo: AcuseRecibo | null = null;
    errorMensaje: string | null = null;

    dependencias = [
        'Policía Municipal',
        'Fiscalía General',
        'Contraloría',
        'CONEVAL',
        'Otra'
    ];

    tipos_identificacion = [
        'CURP',
        'INE',
        'Cédula Profesional',
        'Pasaporte',
        'Licencia de Conducir',
        'Otra'
    ];

    constructor(
        private fb: FormBuilder,
        private denunciaService: DenunciaService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.inicializarFormulario();
    }

    inicializarFormulario(): void {
        this.formulario = this.fb.group({
            tipo_denunciante: ['anonimo', Validators.required],
            nombre_denunciante: [''],
            correo_denunciante: ['', Validators.email],
            telefono_denunciante: [''],
            tipo_identificacion: [''],
            numero_identificacion: [''],
            titulo_denuncia: ['', Validators.required, Validators.minLength(10)],
            descripcion_denuncia: ['', Validators.required, Validators.minLength(50)],
            fecha_hechos: [''],
            lugar_hechos: [''],
            dependencia_implicada: [''],
            prioridad: ['media']
        });

        // Suscribirse a cambios de tipo_denunciante

        this.formulario.get('tipo_denunciante')?.valueChanges.subscribe(value => {
            this.esAnonimo = value === 'anonimo';
            this.actualizarValidadores();
        });
    }

    actualizarValidadores(): void {
        const nombre = this.formulario.get('nombre_denunciante');
        const correo = this.formulario.get('correo_denunciante');
        const tipo_id = this.formulario.get('tipo_identificacion');
        const numero_id = this.formulario.get('numero_identificacion');

        if (this.esAnonimo) {
            nombre?.clearAsyncValidators();
            nombre?.clearValidators();
            correo?.clearAsyncValidators();
            correo?.clearValidators();
            tipo_id?.clearAsyncValidators();
            tipo_id?.clearValidators();
            numero_id?.clearAsyncValidators();
            numero_id?.clearValidators();
            nombre?.setValidators([Validators.required]);
            correo?.setValidators([Validators.required, Validators.email]);
            tipo_id?.setValidators([Validators.required]);
            numero_id?.setValidators([Validators.required]);
        }

        nombre?.updateValueAndValidity();
        correo?.updateValueAndValidity();
        tipo_id?.updateValueAndValidity();
        numero_id?.updateValueAndValidity();
    }

    enviarDenuncia(): void {
        if (this.formulario.invalid) {
            this.errorMensaje = 'Por favor, completa todos los campos requeridos correctamente.';
            return;
        }
        this.cargando = true;
        this.errorMensaje = null;

        const denuncia: Denuncia = this.formulario.value;

        this.denunciaService.crearDenuncia(denuncia).subscribe({
            next: (respuesta) => {
                this.acuseRecibo = respuesta.acuse_recibo;
                this.denunciaService.guardarAcuseRecibo(this.acuseRecibo);
                this.enviado = true;
                this.cargando = false;

                //Redirigir al acuse de recibo despues de 2 segundos

                setTimeout(() => {
                    this.router.navigate(['/denuncias/acuse-recibo']);
                }, 2000);
            },
            error: (error) => {
                this.cargando = false;
                this.errorMensaje = error.error?.message || 'Error al crear la denuncia. Intenta nuevamente.';
                console.error('Error:', error);
            }
        });
    }

    get controlesMostrados() {
        return this.formulario.controls;
    }

    tieneError(nombreControl: string): boolean {
        const control = this.formulario.get(nombreControl);
        return control ? control.invalid && (control.dirty || control.touched) : false;
    }

    obtenerMensajeError(nombreControl: string): string {
        const control = this.formulario.get(nombreControl);
        if (!control || !control.errors) return '';

        if (control.errors['required']) return 'Este campo es requerido.';
        if (control.errors['minlength']) return `Mínimo ${control.errors['minlength'].requiredLength} caracteres.`;
        if (control.errors['email']) return 'Correo electrónico no válido.';
        return 'Campo inválido.';
    }
}