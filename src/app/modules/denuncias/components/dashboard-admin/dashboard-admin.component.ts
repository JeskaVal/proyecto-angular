import { Component, OnInit } from '@angular/core';
import { EstadisticasService } from '../../services/estadisticas.service';
import { DashboardData } from '../../models/estadisticas.model';
import { argsArgArrayOrObject } from 'rxjs/internal/util/argsArgArrayOrObject';
import { setEnableTemplateSourceLocations } from '@angular/compiler';
import { DatePipe, NgIf, NgFor, NgClass, UpperCasePipe, DecimalPipe } from '@angular/common';

@Component({
    selector: 'app-dashboard-admin',
    templateUrl: './dashboard-admin.component.html',
    styleUrls: ['./dashboard-admin.component.scss'],
    imports: [DatePipe, NgIf, NgFor, NgClass, UpperCasePipe, DecimalPipe]
})
export class DashboardAdminComponent implements OnInit {
    dashboard: DashboardData | null = null;
    cargando = true;
    errorMensaje: string | null = null;
    fechaActualizacion: Date = new Date();


    coloresEstados = {
        'recibida': '#0066cc',
        'en_revision': '#ff9800',
        'en_proceso': '#2196f3',
        'resuelta': '#4caf50',
        'archivada': '#999999',
    };

    etiquetasEstados = {
        'recibida': 'Recibida',
        'en_revision': 'En Revisión',
        'en_proceso': 'En Proceso',
        'resuelta': 'Resuelta',
        'archivada': 'Archivada'
    };

    constructor(private estadisticasService:EstadisticasService) {}

    ngOnInit(): void {
        this.cargarDashboard();
        setInterval(() => this.cargarDashboard(), 3000); //Actualiza cada 30 segundos
    }

    cargarDashboard(): void {
        this.cargando = true;
        this.errorMensaje = null;

        this.estadisticasService.obtenerDashboard().subscribe({
            next: (respuesta) => {
                this.dashboard = respuesta.data;
                this.fechaActualizacion = new Date();
                this.cargando = false;
            },
            error: (error) => {
                this.cargando = false;
                this.errorMensaje = 'Error al cargar el dashboard';
                console.error('Error:', error);
            }
        });
    }
    obtenerPorcentajeEstado(estado: string): number {
        if (!this.dashboard) return 0;
        const item = this.dashboard.por_estado.find(e => e.estado === estado);
        return item ? item.porcentaje : 0;
    }

    obtenerColorEstado(estado: string): string {
        return this.coloresEstados[estado as keyof typeof this.coloresEstados] || '#999';
    }

    obtenerLabelEstado(estado: string): string {
        return this.etiquetasEstados[estado as keyof typeof this.etiquetasEstados] || estado;
    }
}
