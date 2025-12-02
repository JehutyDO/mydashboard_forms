// src/lib/types/evento.types.ts

export interface Evento {
  evento_id: number;
  uuid: string;
  nombre: string;
  fecha: string;
  hora?: string;
  lugar?: string;
  descripcion?: string;
  capacidad_total?: number;
  tipo_evento: 'boda' | 'xv' | 'cumpleaños' | 'corporativo' | 'otro';
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
