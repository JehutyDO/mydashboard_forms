"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Loader2, Save, CheckCircle2, XCircle, ArrowLeft } from "lucide-react";

import { eventoSchema, type EventoSchemaType } from "@/lib/validators/evento.schema";
import { createEvento } from "@/lib/api/eventos.service";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface FormStatus {
  type: 'success' | 'error' | null;
  message: string;
}

export default function EventoForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<FormStatus>({ type: null, message: '' });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<EventoSchemaType>({
    resolver: zodResolver(eventoSchema),
    defaultValues: {
      nombre: "",
      fecha: "",
      hora: "",
      lugar: "",
      descripcion: "",
      capacidad_total: 50,
      tipo_evento: "boda",
      estado: "borrador",
    },
  });

  const onSubmit = async (data: EventoSchemaType) => {
    try {
      setIsSubmitting(true);
      setFormStatus({ type: null, message: '' });

      // z.coerce.number() already converts the string to number automatically
      const response = await createEvento(data);

      if (response.success) {
        setFormStatus({
          type: 'success',
          message: '✅ Evento creado exitosamente!',
        });
        reset();
        
        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setFormStatus({ type: null, message: '' });
        }, 5000);
      } else {
        throw new Error(response.message || 'Error al crear el evento');
      }
    } catch (error) {
      console.error('Error:', error);
      setFormStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Error desconocido al crear el evento',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const tipoEventoValue = watch("tipo_evento");
  const estadoValue = watch("estado");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto"
    >
      <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="space-y-2 pb-6 border-b border-gray-100">
          <CardTitle className="text-3xl font-bold text-gray-900">
            Crear Nuevo Evento
          </CardTitle>
          <CardDescription className="text-base text-gray-600">
            Complete el formulario para registrar un nuevo evento en el sistema
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Alert Messages */}
            {formStatus.type && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`p-4 rounded-lg border flex items-center gap-3 ${
                  formStatus.type === 'success'
                    ? 'bg-green-50 border-green-200 text-green-800'
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}
              >
                {formStatus.type === 'success' ? (
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                ) : (
                  <XCircle className="h-5 w-5 shrink-0" />
                )}
                <p className="font-medium">{formStatus.message}</p>
              </motion.div>
            )}

            {/* Nombre del Evento */}
            <div className="space-y-2">
              <Label htmlFor="nombre" className="text-gray-700 font-semibold">
                Nombre del Evento <span className="text-[#ff3ea5]">*</span>
              </Label>
              <Input
                id="nombre"
                placeholder="Ej: Boda de María y Juan"
                {...register("nombre")}
                className={errors.nombre ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {errors.nombre && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-600 flex items-center gap-1"
                >
                  {errors.nombre.message}
                </motion.p>
              )}
            </div>

            {/* Fecha y Hora */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fecha" className="text-gray-700 font-semibold">
                  Fecha del Evento <span className="text-[#ff3ea5]">*</span>
                </Label>
                <Input
                  id="fecha"
                  type="date"
                  {...register("fecha")}
                  className={errors.fecha ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                {errors.fecha && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-600"
                  >
                    {errors.fecha.message}
                  </motion.p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="hora" className="text-gray-700 font-semibold">
                  Hora del Evento
                </Label>
                <Input
                  id="hora"
                  type="time"
                  {...register("hora")}
                  className={errors.hora ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                {errors.hora && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-600"
                  >
                    {errors.hora.message}
                  </motion.p>
                )}
              </div>
            </div>

            {/* Lugar */}
            <div className="space-y-2">
              <Label htmlFor="lugar" className="text-gray-700 font-semibold">
                Lugar
              </Label>
              <Input
                id="lugar"
                placeholder="Ej: Jardín Los Pinos, Calle Principal #123"
                {...register("lugar")}
                className={errors.lugar ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {errors.lugar && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-600"
                >
                  {errors.lugar.message}
                </motion.p>
              )}
            </div>

            {/* Tipo de Evento y Capacidad */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="tipo_evento" className="text-gray-700 font-semibold">
                  Tipo de Evento <span className="text-[#ff3ea5]">*</span>
                </Label>
                <Select
                  value={tipoEventoValue}
                  onValueChange={(value) => setValue("tipo_evento", value as EventoSchemaType['tipo_evento'])}
                >
                  <SelectTrigger className={errors.tipo_evento ? "border-red-500" : ""}>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="boda">🎊 Boda</SelectItem>
                    <SelectItem value="xv">👑 XV Años</SelectItem>
                    <SelectItem value="cumpleaños">🎂 Cumpleaños</SelectItem>
                    <SelectItem value="corporativo">💼 Corporativo</SelectItem>
                    <SelectItem value="otro">🎉 Otro</SelectItem>
                  </SelectContent>
                </Select>
                {errors.tipo_evento && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-600"
                  >
                    {errors.tipo_evento.message}
                  </motion.p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacidad_total" className="text-gray-700 font-semibold">
                  Capacidad Total <span className="text-[#ff3ea5]">*</span>
                </Label>
                <Input
                  id="capacidad_total"
                  type="number"
                  min="1"
                  placeholder="Ej: 100"
                  {...register("capacidad_total", { valueAsNumber: true })}
                  className={errors.capacidad_total ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                {errors.capacidad_total && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-600"
                  >
                    {errors.capacidad_total.message}
                  </motion.p>
                )}
              </div>
            </div>

            {/* Estado */}
            <div className="space-y-2">
              <Label htmlFor="estado" className="text-gray-700 font-semibold">
                Estado <span className="text-[#ff3ea5]">*</span>
              </Label>
              <Select
                value={estadoValue}
                onValueChange={(value) => setValue("estado", value as EventoSchemaType['estado'])}
              >
                <SelectTrigger className={errors.estado ? "border-red-500" : ""}>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="borrador">📝 Borrador</SelectItem>
                  <SelectItem value="activo">✅ Activo</SelectItem>
                  <SelectItem value="finalizado">🏁 Finalizado</SelectItem>
                </SelectContent>
              </Select>
              {errors.estado && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-600"
                >
                  {errors.estado.message}
                </motion.p>
              )}
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <Label htmlFor="descripcion" className="text-gray-700 font-semibold">
                Descripción
              </Label>
              <Textarea
                id="descripcion"
                placeholder="Describe los detalles del evento..."
                rows={4}
                {...register("descripcion")}
                className={errors.descripcion ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {errors.descripcion && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-600"
                >
                  {errors.descripcion.message}
                </motion.p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-gray-100 flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/')}
                className="h-12 text-base font-semibold"
                size="lg"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Volver
              </Button>
              
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 h-12 text-base font-semibold"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creando evento...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-5 w-5" />
                    Crear Evento
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
