export interface Denuncia {
    id?: number;
    folio: string;
    tipo_denunciante: 'anonimo' | 'identificado';
    nombre_denunciante?: string;
    correo_denunciante?: string;
    telefono_denunciante?: string;
    tipo_identificacion: string;
    numero_identificacion?: string;
    titulo_denuncia: string;
    descripcion_denuncia: string;
    fecha_hechos?: string;
    lugar_hechos?: string;
    dependencia_implicada?: string;
    estado?: 'recibida' | 'en_revision' | 'en_proceso' | 'resuelta' | 'archivada';
    prioridad?: 'baja' | 'media' | 'alta' | 'urgente';
    fecha_recibida?: string;
    fecha_ultimaActualizacion?: string;

}

export interface AcuseRecibo {
    folio: string;
    fecha_recibida: string;
    titulo_denuncia: string;
    estado: string;
    contrasena_acceso: string;
    proximos_pasos: string[];
}

export interface DenunciaResponse {
    success: boolean;
    message: string;
    data: Denuncia;
    acuse_recibo: AcuseRecibo;
}