// src/lib/types/evento.types.ts

export interface Evento {
  evento_id: number;
  uuid: string;
  nombre: string;
  tipo_evento: 'boda' | 'xv' | 'cumpleaños' | 'corporativo' | 'otro';
  
  // Involucrados
  nombre_involucrado_1: string;
  nombre_involucrado_2?: string;
  
  // Fiesta principal
  fecha: string;
  hora: string;
  lugar: string;
  
  // Ceremonia (opcional)
  lugar_ceremonia?: string;
  hora_ceremonia?: string;
  
  descripcion?: string;
  capacidad_total?: number;
  estado: 'borrador' | 'activo' | 'finalizado';
  created_at: string;
  updated_at: string;
}

export type EventoFormData = Omit<
  Evento,
  'evento_id' | 'uuid' | 'created_at' | 'updated_at'
>;

export interface EventoResponse {
  success: boolean;
  data?: Evento;
  message?: string;
  error?: string;
}

export interface EventosListResponse {
  success: boolean;
  data?: Evento[];
  message?: string;
  error?: string;
}
