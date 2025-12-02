// src/lib/validators/evento.schema.ts

import { z } from "zod";

export const eventoSchema = z.object({
  nombre: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  
  fecha: z
    .string()
    .min(1, "La fecha es requerida")
    .refine((val) => {
      const date = new Date(val);
      return !isNaN(date.getTime());
    }, "Fecha inválida"),
  
  hora: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true;
      return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(val);
    }, "Hora inválida (formato HH:MM)"),
  
  lugar: z
    .string()
    .max(200, "El lugar no puede exceder 200 caracteres")
    .optional(),
  
  descripcion: z
    .string()
    .max(1000, "La descripción no puede exceder 1000 caracteres")
    .optional(),
  
  capacidad_total: z
    .number({ message: "La capacidad debe ser un número válido" })
    .int("La capacidad debe ser un número entero")
    .min(1, "La capacidad debe ser al menos 1")
    .max(10000, "La capacidad no puede exceder 10,000"),
  
  tipo_evento: z.enum(['boda', 'xv', 'cumpleaños', 'corporativo', 'otro'], "Tipo de evento inválido"),
  
  estado: z.enum(['borrador', 'activo', 'finalizado'], "Estado inválido")
});

export type EventoSchemaType = z.infer<typeof eventoSchema>;
