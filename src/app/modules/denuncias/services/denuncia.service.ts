import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../../../environments/environment'; //TODO: Verificar si esta ruta es correcta para el entorno
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

    // Consultar denuncia por folio
    consultarPorFolio(folio: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${folio}`);
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

}