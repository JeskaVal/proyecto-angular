export interface DashboardData {
    totales: {
        total_denuncias: number;
        denuncias_recibidas_hoy: number;
        denuncias_resueltas: number;
        denuncias_en_proceso: number;
    };
    por_estado: EstadoData[];
    por_prioridad: PrioridadData[];
    ultimas_7_dias: DiaData[];
    promedio_tiempo_resolucion: number;
    denuncias_recientes: DenunciaReciente[];
}

export interface EstadoData {
    estado: string;
    cantidad: number;
    porcentaje: number;
}

export interface PrioridadData {
    estado: string;
    cantidad: number;
    porcentaje: number;
}

export interface PrioridadData {
    prioridad: string;
    cantidad: number;
}

export interface DiaData {
    fecha: string;
    cantidad: number;
}

export interface DenunciaReciente {
    folio: string;
    titulo: string;
    estado: string;
    prioridad: string;
    fecha_recibida: string;
}

export interface Reporte {
    periodo: {
        desde: string;
        hasta: string;
    };
    resumen: {
        total_denuncias: number;
        denuncias_anonimas: number;
        denuncias_identificadas: number;
        por_prioridad: PrioridadData[];
        por_estado: EstadoData[];
        dependencias_principales: any[];
    };
}