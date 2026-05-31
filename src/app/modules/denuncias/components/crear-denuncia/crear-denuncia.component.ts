import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DenunciaService } from '../../services/denuncia.service';
import { Denuncia, AcuseRecibo } from '../../models/denuncia.model';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { timeout } from 'rxjs/operators';

@Component({
    standalone: true,
    selector: 'app-crear-denuncia',
    templateUrl: './crear-denuncia.component.html',
    styleUrl: './crear-denuncia.component.scss',
    imports: [CommonModule, FormsModule, ReactiveFormsModule]
})

export class CrearDenunciaComponent implements OnInit {
    formulario!: FormGroup;
    cargando = false;
    enviado = false;
    esAnonimo = true;
    acuseRecibo: AcuseRecibo | null = null;
    errorMensaje: string | null = null;

    conexionEstado: 'verificando' | 'conectado' | 'error' | null = null;
    mensajeConexion = '';

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
        private router: Router,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {}

    ngOnInit(): void {
        this.inicializarFormulario();
        this.probarConexion();
    }

    probarConexion(): void {
        if (!isPlatformBrowser(this.platformId)) return;

        this.conexionEstado = 'verificando';
        this.mensajeConexion = 'Verificando conexión con el servidor...';

        this.denunciaService.verificarConexion().pipe(timeout(10000)).subscribe({
            next: (resp) => {
                this.conexionEstado = 'conectado';
                this.mensajeConexion = `Conexión exitosa con el backend (Laravel ${resp.version_laravel} · PHP ${resp.version_php})`;
                setTimeout(() => { this.conexionEstado = null; }, 5000);
            },
            error: (err) => {
                this.conexionEstado = 'error';
                this.mensajeConexion = err?.name === 'TimeoutError'
                    ? 'Tiempo de espera agotado (10s). Verifica que el servidor Laravel esté en ejecución.'
                    : 'No se pudo conectar con el backend. Verifica que el servidor esté en ejecución.';
                setTimeout(() => { this.conexionEstado = null; }, 8000);
            }
        });
    }

    inicializarFormulario(): void {
        this.formulario = this.fb.group({
            tipo_denunciante: ['anonimo', Validators.required],
            nombre_denunciante: [''],
            correo_denunciante: ['', Validators.email],
            telefono_denunciante: [''],
            tipo_identificacion: [''],
            numero_identificacion: [''],
            titulo_denuncia: ['', [Validators.required, Validators.minLength(10)]],
            descripcion_denuncia: ['', [Validators.required, Validators.minLength(50)]],
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

        if (!this.esAnonimo) {
            nombre?.setValidators([Validators.required]);
            correo?.setValidators([Validators.required, Validators.email]);
            tipo_id?.setValidators([Validators.required]);
            numero_id?.setValidators([Validators.required]);
        } else {
            nombre?.clearValidators();
            correo?.clearValidators();
            tipo_id?.clearValidators();
            numero_id?.clearValidators();
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

    irAConsultar(): void {
        this.router.navigate(['/denuncias/consultar']);
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