"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
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
import { createEvento } from "@/lib/api/eventos.service";
import { eventoSchema, type EventoSchemaType } from "@/lib/validators/evento.schema";

export default function NuevoEventoPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<EventoSchemaType>({
    resolver: zodResolver(eventoSchema),
    defaultValues: {
      nombre: "",
      tipo_evento: "otro",
      nombre_involucrado_1: "",
      nombre_involucrado_2: "",
      fecha: "",
      hora: "",
      lugar: "",
      lugar_ceremonia: "",
      hora_ceremonia: "",
      descripcion: "",
      capacidad_total: 0,
      estado: "borrador",
    },
  });

  const tipoEventoValue = watch("tipo_evento");
  const estadoValue = watch("estado");

  const onSubmit = async (data: EventoSchemaType) => {
    try {
      setIsSubmitting(true);
      await createEvento(data);
      router.push("/eventos");
    } catch (error) {
      console.error("Error al crear evento:", error);
      alert("Error al crear el evento. Por favor, intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#f0f9ff] via-white to-[#e0f2fe] p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/eventos")}
            className="rounded-xl hover:bg-blue-50 hover:border-[#3b82f6]"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              🎉 Crear Nuevo Evento
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Completa la información del evento
            </p>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 p-6 sm:p-8"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                onClick={() => router.push("/eventos")}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-[#3b82f6] hover:bg-[#2563eb]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Crear Evento
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
