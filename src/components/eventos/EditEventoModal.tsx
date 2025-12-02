"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Loader2 } from "lucide-react";
import { eventoSchema, type EventoSchemaType } from "@/lib/validators/evento.schema";
import { updateEvento } from "@/lib/api/eventos.service";
import type { Evento } from "@/lib/types/evento.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditEventoModalProps {
  evento: Evento;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditEventoModal({
  evento,
  onClose,
  onSuccess,
}: EditEventoModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<EventoSchemaType>({
    resolver: zodResolver(eventoSchema),
    defaultValues: {
      nombre: evento.nombre,
      tipo_evento: evento.tipo_evento,
      nombre_involucrado_1: evento.nombre_involucrado_1,
      nombre_involucrado_2: evento.nombre_involucrado_2 || "",
      fecha: evento.fecha,
      hora: evento.hora,
      lugar: evento.lugar,
      lugar_ceremonia: evento.lugar_ceremonia || "",
      hora_ceremonia: evento.hora_ceremonia || "",
      descripcion: evento.descripcion || "",
      capacidad_total: evento.capacidad_total || 0,
      estado: evento.estado,
    },
  });

  const onSubmit = async (data: EventoSchemaType) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await updateEvento(evento.evento_id, data);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar evento");
    } finally {
      setIsSubmitting(false);
    }
  };

  const tipoEventoValue = watch("tipo_evento");
  const estadoValue = watch("estado");

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
            <h2 className="text-2xl font-bold text-gray-900">Editar Evento</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Nombre */}
            <div className="space-y-2">
              <Label htmlFor="nombre">
                Nombre del Evento <span className="text-[#3b82f6]">*</span>
              </Label>
              <Input
                id="nombre"
                placeholder="Ej: Boda Mau & X"
                {...register("nombre")}
                className={errors.nombre ? "border-red-500" : ""}
              />
              {errors.nombre && (
                <p className="text-sm text-red-600">{errors.nombre.message}</p>
              )}
            </div>

            {/* Tipo de Evento */}
            <div className="space-y-2">
              <Label htmlFor="tipo_evento">
                Tipo de Evento <span className="text-[#3b82f6]">*</span>
              </Label>
              <Select
                value={tipoEventoValue}
                onValueChange={(value) =>
                  setValue("tipo_evento", value as EventoSchemaType["tipo_evento"])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="boda">💒 Boda</SelectItem>
                  <SelectItem value="xv">👑 XV Años</SelectItem>
                  <SelectItem value="cumpleaños">🎂 Cumpleaños</SelectItem>
                  <SelectItem value="corporativo">💼 Corporativo</SelectItem>
                  <SelectItem value="otro">🎉 Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Involucrados */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-gray-900">👥 Involucrados</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre_involucrado_1">
                    Primer Involucrado <span className="text-[#3b82f6]">*</span>
                  </Label>
                  <Input
                    id="nombre_involucrado_1"
                    placeholder="Novio / Quinceañera / Cumpleañero"
                    {...register("nombre_involucrado_1")}
                    className={errors.nombre_involucrado_1 ? "border-red-500" : ""}
                  />
                  {errors.nombre_involucrado_1 && (
                    <p className="text-sm text-red-600">{errors.nombre_involucrado_1.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nombre_involucrado_2">
                    Segundo Involucrado (opcional)
                  </Label>
                  <Input
                    id="nombre_involucrado_2"
                    placeholder="Novia / Socio / etc."
                    {...register("nombre_involucrado_2")}
                  />
                </div>
              </div>
            </div>

            {/* Fiesta Principal */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-gray-900">🎉 Fiesta Principal</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fecha">
                    Fecha <span className="text-[#3b82f6]">*</span>
                  </Label>
                  <Input
                    id="fecha"
                    type="date"
                    {...register("fecha")}
                    className={errors.fecha ? "border-red-500" : ""}
                  />
                  {errors.fecha && (
                    <p className="text-sm text-red-600">{errors.fecha.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hora">
                    Hora <span className="text-[#3b82f6]">*</span>
                  </Label>
                  <Input 
                    id="hora" 
                    type="time" 
                    {...register("hora")}
                    className={errors.hora ? "border-red-500" : ""}
                  />
                  {errors.hora && (
                    <p className="text-sm text-red-600">{errors.hora.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lugar">
                  Lugar <span className="text-[#3b82f6]">*</span>
                </Label>
                <Input 
                  id="lugar" 
                  placeholder="Lugar de la fiesta"
                  {...register("lugar")}
                  className={errors.lugar ? "border-red-500" : ""}
                />
                {errors.lugar && (
                  <p className="text-sm text-red-600">{errors.lugar.message}</p>
                )}
              </div>
            </div>

            {/* Ceremonia (Opcional) */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold text-lg text-gray-900">⛪ Ceremonia (Opcional)</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lugar_ceremonia">Lugar Ceremonia</Label>
                  <Input
                    id="lugar_ceremonia"
                    placeholder="Iglesia / Salón"
                    {...register("lugar_ceremonia")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hora_ceremonia">Hora Ceremonia</Label>
                  <Input id="hora_ceremonia" type="time" {...register("hora_ceremonia")} />
                </div>
              </div>
            </div>

            {/* Capacidad */}
            <div className="space-y-2">
              <Label htmlFor="capacidad_total">
                Capacidad Total
              </Label>
              <Input
                id="capacidad_total"
                type="number"
                min="1"
                placeholder="Número de invitados"
                {...register("capacidad_total", { valueAsNumber: true })}
              />
            </div>

            {/* Estado */}
            <div className="space-y-2">
              <Label htmlFor="estado">
                Estado <span className="text-[#3b82f6]">*</span>
              </Label>
              <Select
                value={estadoValue}
                onValueChange={(value) =>
                  setValue("estado", value as EventoSchemaType["estado"])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="borrador">📝 Borrador</SelectItem>
                  <SelectItem value="activo">✅ Activo</SelectItem>
                  <SelectItem value="finalizado">🏁 Finalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                placeholder="Detalles adicionales del evento..."
                rows={3}
                {...register("descripcion")}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar Cambios
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
