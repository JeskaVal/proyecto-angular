import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Denuncia, DenunciaResponse, AcuseRecibo } from '../models/denuncia.model';

@Injectable({
    providedIn: 'root'
})
export class DenunciaService {
    private apiUrl = `${environment.apiUrl}/denuncias`;
    private acuseRecibo$ = new BehaviorSubject<AcuseRecibo | null>(null);

    constructor(private http: HttpClient) {}

    // Crear denuncia
    crearDenuncia(denuncia: Denuncia): Observable<DenunciaResponse> {
        return this.http.post<DenunciaResponse>(this.apiUrl,denuncia);
    }

    // Consultar denuncia por folio (uso interno/admin)
    consultarPorFolio(folio: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${folio}`);
    }

    // Consultar denuncia con contraseña de acceso (uso público)
    consultarConContrasena(folio: string, contrasenaAcceso: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/consultar`, {
            folio,
            contrasena_acceso: contrasenaAcceso,
        });
    }

    // Listar mis denuncias (para usuarios identificados)
    misDenuncias(): Observable<any> {
        return this.http.get<any>(this.apiUrl);
    }

    // Obtener último acuse de recibo
    getUltimoAcuseRecibo(): Observable<AcuseRecibo | null> {
        return this.acuseRecibo$.asObservable();
    }

    // Guardar acuse de recibo
    guardarAcuseRecibo(acuse: AcuseRecibo): void {
        this.acuseRecibo$.next(acuse);
    }

    // Limpiar acuse de recibo
    limpiarAcuseRecibo(): void {
        this.acuseRecibo$.next(null);
    }

    // POST /api/denuncias/{folio}/archivos - Subir archivo
    subirArchivo(folio: string, archivo: File): Observable<any> {
        const formData = new FormData();
        formData.append('archivo', archivo);

        return this.http.post<any>(
            `${this.apiUrl}/${folio}/archivos`,
            formData
        );
    }

    // POST /api/denuncias/{folio}/archivos - Obtener archivos
    obtenerArchivos(folio: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${folio}/archivos`);
    }

    //GET /api/denuncias/archivos/{id}/descargar - Descargar Archivo
    descargarArchivo(archivoId: number): Observable<Blob> {
        return this.http.get<Blob>(
            `{this.apiUrl}/archivos/${archivoId}/descargar`,
            { responseType: 'blob' as 'json' }
        );
    }

    // GET /api/denuncias/{folio}/bitacora - Obtener bitácora
    obtenerBitacora(folio: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${folio}/bitacora`);
    }

    //GET /api/denuncias/buscar - Buscar denuncias
    buscarDenuncias(filtros: any): Observable<any> {
        let params = new URLSearchParams();

        if (filtros.folio) params.append('filtro', filtros.folio);
        if (filtros.estado) params.append('estado', filtros.estado);
        if (filtros.prioridad) params.append('prioridad', filtros.prioridad);
        if (filtros.fecha_desde) params.append('fecha_desde', filtros.fecha_desde);
        if (filtros.fecha_hasta) params.append('fecha_hasta', filtros.fecha_hasta);
        if (filtros.titulo) params.append('titulo', filtros.titulo);

        return this.http.get<any>(
            `${this.apiUrl}/buscar?${params.toString()}`
        );
    }

    //PUT /api/denuncias/{folio}/estado - Cambiar estado
    cambiarEstado(folio: string, estado: string, descripcion: string): Observable<any> {
        return this.http.put<any>(
            `${this.apiUrl}/${folio}/estado`,
            { estado, descripcion }
        );
    }
}