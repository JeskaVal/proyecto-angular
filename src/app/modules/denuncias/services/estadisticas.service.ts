import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { DashboardData, Reporte } from '../models/estadisticas.model';

@Injectable({
    providedIn: 'root'
})
export class EstadisticasService {
    private apiUrl = `${environment.apiUrl}`;

    constructor(private http: HttpClient) {}

    obtenerDashboard(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/dashboard`);
    }

    obtenerReporte(fechaDesde?: string, fechaHasta?: string): Observable<any> {
        let params = '';
        if (fechaDesde) params += `?fecha_desde=${fechaDesde}`;
        if (fechaHasta) params += params ? `&fecha_hasta=${fechaHasta}` : `?fecha_hasta=${fechaHasta}`;

        return this.http.get<any>(`${this.apiUrl}/reportes${params}`);
    }

    exportarReporte(fechaDesde?: string, fechaHasta?: string): Observable<Blob> {
        let params = '';
        if (fechaDesde) params += `?fecha_desde=${fechaDesde}`;
        if (fechaHasta) params += params ? `$fecha_hasta=${fechaHasta}` : `?fecha_hasta=${fechaHasta}`;

        return this.http.get<Blob>(
            `${this.apiUrl}/exportar-reportes${params}`, { responseType: 'blob' as 'json' }
        );
    }
}