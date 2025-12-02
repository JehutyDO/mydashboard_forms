// src/lib/validators/evento.schema.ts
import { z } from "zod";

export const eventoSchema = z.object({
  nombre: z.string().min(1, "El nombre del evento es requerido"),
  tipo_evento: z.enum(["boda", "xv", "cumpleaños", "corporativo", "otro"]),
  
  // Involucrados
  nombre_involucrado_1: z.string().min(1, "El primer involucrado es requerido"),
  nombre_involucrado_2: z.string().optional(),
  
  // Fiesta principal
  fecha: z.string().min(1, "La fecha es requerida"),
  hora: z.string().min(1, "La hora es requerida"),
  lugar: z.string().min(1, "El lugar es requerido"),
  
  // Ceremonia (opcional)
  lugar_ceremonia: z.string().optional(),
  hora_ceremonia: z.string().optional(),
  
  descripcion: z.string().optional(),
  capacidad_total: z.number().positive().optional(),
  estado: z.enum(["borrador", "activo", "finalizado"]),
});

export type EventoSchemaType = z.infer<typeof eventoSchema>;
