import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

interface PingResponse {
    status: string;
    mensaje: string;
    hora_servidor: string;
    version_php: string;
    version_laravel: string;
}

@Component({
    standalone: true,
    imports: [CommonModule],
    selector: 'app-ping-test',
    template: `
        <div class="contenedor">
            <div class="encabezado">
                <h1>🔌 Prueba de Conexión</h1>
                <p class="api-url">API: <code>{{ apiUrl }}</code></p>
            </div>

            <button class="boton" (click)="probar()" [disabled]="estado === 'cargando'">
                @if (estado === 'cargando') { ⏳ Probando... }
                @else { 🚀 Probar Conexión }
            </button>

            @if (estado === 'exito') {
                <div class="resultado exito">
                    <div class="fila titulo-resultado">
                        <span class="icono-estado">✅</span>
                        <strong>Backend conectado</strong>
                        <span class="badge-latencia">{{ latencia }}ms</span>
                    </div>
                    <div class="grid-datos">
                        <div class="dato">
                            <span class="etiqueta">CORS</span>
                            <span class="valor verde">Activo ✓</span>
                        </div>
                        <div class="dato">
                            <span class="etiqueta">Hora del servidor</span>
                            <span class="valor">{{ resultado?.hora_servidor | date:'medium' }}</span>
                        </div>
                        <div class="dato">
                            <span class="etiqueta">PHP</span>
                            <span class="valor">{{ resultado?.version_php }}</span>
                        </div>
                        <div class="dato">
                            <span class="etiqueta">Laravel</span>
                            <span class="valor">{{ resultado?.version_laravel }}</span>
                        </div>
                    </div>
                </div>
            }

            @if (estado === 'error') {
                <div class="resultado error">
                    <div class="fila titulo-resultado">
                        <span class="icono-estado">❌</span>
                        <strong>Sin conexión</strong>
                        <span class="badge-latencia badge-error">{{ latencia }}ms</span>
                    </div>
                    <div class="grid-datos">
                        <div class="dato">
                            <span class="etiqueta">Error</span>
                            <span class="valor rojo">{{ errorDetalle }}</span>
                        </div>
                        <div class="dato">
                            <span class="etiqueta">Posibles causas</span>
                            <ul class="lista-causas">
                                <li>El servidor Laravel no está corriendo (<code>php artisan serve</code>)</li>
                                <li>El origen <code>http://localhost:4200</code> no está en <code>config/cors.php</code></li>
                                <li>La URL de la API es incorrecta (<code>{{ apiUrl }}</code>)</li>
                            </ul>
                        </div>
                    </div>
                </div>
            }
        </div>
    `,
    styles: [`
        .contenedor {
            max-width: 680px;
            margin: 60px auto;
            padding: 0 20px;
            font-family: sans-serif;
        }
        .encabezado { margin-bottom: 28px; }
        .encabezado h1 { font-size: 1.8rem; margin: 0 0 8px; }
        .api-url { color: #666; margin: 0; font-size: 0.9rem; }
        .boton {
            padding: 12px 28px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            margin-bottom: 28px;
        }
        .boton:disabled { opacity: 0.6; cursor: not-allowed; }
        .resultado {
            border-radius: 12px;
            padding: 24px;
            border: 1px solid;
        }
        .resultado.exito { background: #f0fdf4; border-color: #86efac; }
        .resultado.error { background: #fff1f2; border-color: #fca5a5; }
        .titulo-resultado {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 20px;
            font-size: 1.1rem;
        }
        .icono-estado { font-size: 1.3rem; }
        .badge-latencia {
            margin-left: auto;
            background: #dcfce7;
            color: #166534;
            padding: 3px 10px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 700;
        }
        .badge-error { background: #fee2e2; color: #991b1b; }
        .grid-datos {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
        }
        .dato .etiqueta {
            display: block;
            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
            color: #888;
            margin-bottom: 4px;
        }
        .dato .valor { font-size: 0.95rem; color: #333; }
        .verde { color: #16a34a; font-weight: 600; }
        .rojo { color: #dc2626; }
        .lista-causas {
            margin: 4px 0 0;
            padding-left: 18px;
            font-size: 0.88rem;
            color: #555;
            line-height: 1.8;
        }
        @media (max-width: 500px) {
            .grid-datos { grid-template-columns: 1fr; }
        }
    `]
})
export class PingTestComponent {
    private http = inject(HttpClient);

    readonly apiUrl = environment.apiUrl;

    estado: 'idle' | 'cargando' | 'exito' | 'error' = 'idle';
    resultado: PingResponse | null = null;
    latencia: number | null = null;
    errorDetalle: string | null = null;

probar(): void {
        this.estado = 'cargando';
        this.resultado = null;
        this.errorDetalle = null;
        const inicio = Date.now();

        this.http.get<any>(`${this.apiUrl}/ping`).subscribe({
            next: (res) => {
                this.latencia = Date.now() - inicio;
                
                this.resultado = {
                    status: res.status,
                    mensaje: res.mensaje,
                    hora_servidor: res.hora_servidor,
                    version_php: res.version_php,
                    version_laravel: res.version_laravel
                };
                
                this.estado = 'exito';
            },
            error: (err) => {
                this.latencia = Date.now() - inicio;
                this.errorDetalle = err.error?.message || err.message || 'Error de comunicación';
                this.estado = 'error';
                console.error('Detalle completo del fallo:', err);
            }
        });
    }
}