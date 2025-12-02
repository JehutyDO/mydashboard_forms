// src/lib/validators/evento.schema.ts
import { z } from "zod";

export const eventoSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  fecha: z.string().min(1, "La fecha es requerida"),
  hora: z.string().optional(),
  lugar: z.string().optional(),
  descripcion: z.string().optional(),
  capacidad_total: z.number().positive().optional(),
  tipo_evento: z.enum(["boda", "xv", "cumpleaños", "corporativo", "otro"]),
  estado: z.enum(["borrador", "activo", "finalizado"]),
});

export type EventoSchemaType = z.infer<typeof eventoSchema>;
