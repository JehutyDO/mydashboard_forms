"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Edit,
  Trash2,
  Plus,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getEventos, deleteEvento } from "@/lib/api/eventos.service";
import type { Evento } from "@/lib/types/evento.types";
import EditEventoModal from "@/components/eventos/EditEventoModal";

const ESTADO_CONFIG = {
  borrador: {
    label: "📝 Borrador",
    bgColor: "bg-gray-100",
    textColor: "text-gray-800",
    icon: AlertCircle,
  },
  activo: {
    label: "✅ Activo",
    bgColor: "bg-green-100",
    textColor: "text-green-800",
    icon: CheckCircle2,
  },
  finalizado: {
    label: "🏁 Finalizado",
    bgColor: "bg-blue-100",
    textColor: "text-blue-800",
    icon: CheckCircle2,
  },
};

const TIPO_EVENTO_CONFIG = {
  boda: { emoji: "💒", label: "Boda" },
  xv: { emoji: "👑", label: "XV Años" },
  cumpleaños: { emoji: "🎂", label: "Cumpleaños" },
  corporativo: { emoji: "💼", label: "Corporativo" },
  otro: { emoji: "🎉", label: "Otro" },
};

export default function EventosLista() {
  const router = useRouter();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingEvento, setEditingEvento] = useState<Evento | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadEventos = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getEventos();
      setEventos(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar eventos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEventos();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este evento?")) return;

    try {
      setDeletingId(id);
      await deleteEvento(id);
      await loadEventos();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Error al eliminar el evento");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditSuccess = () => {
    setEditingEvento(null);
    loadEventos();
  };

  // Estadísticas
  const stats = {
    total: eventos.length,
    activos: eventos.filter((e) => e.estado === "activo").length,
    borradores: eventos.filter((e) => e.estado === "borrador").length,
    finalizados: eventos.filter((e) => e.estado === "finalizado").length,
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-7xl mx-auto space-y-6"
      >
        {/* Header */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-3xl font-bold text-gray-900">
                  Gestión de Eventos
                </CardTitle>
                <p className="text-gray-600 mt-1">
                  Administra todos tus eventos en un solo lugar
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => router.push("/")}
                  className="h-10"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Inicio
                </Button>
                <Button
                  onClick={() => router.push("/eventos/nuevo")}
                  className="h-10"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Evento
                </Button>
              </div>
            </div>
          </CardHeader>

          {/* Estadísticas */}
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                label="Total"
                value={stats.total}
                icon="📊"
                color="bg-purple-100 text-purple-800"
              />
              <StatCard
                label="Activos"
                value={stats.activos}
                icon="✅"
                color="bg-green-100 text-green-800"
              />
              <StatCard
                label="Borradores"
                value={stats.borradores}
                icon="📝"
                color="bg-gray-100 text-gray-800"
              />
              <StatCard
                label="Finalizados"
                value={stats.finalizados}
                icon="🏁"
                color="bg-blue-100 text-blue-800"
              />
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <Card className="p-12 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-[#ff3ea5] mx-auto mb-4" />
            <p className="text-gray-600">Cargando eventos...</p>
          </Card>
        )}

        {/* Error State */}
        {error && (
          <Card className="p-6 bg-red-50 border-red-200">
            <div className="flex items-center gap-3 text-red-800">
              <XCircle className="h-5 w-5" />
              <p className="font-medium">{error}</p>
            </div>
          </Card>
        )}

        {/* Empty State */}
        {!isLoading && !error && eventos.length === 0 && (
          <Card className="p-12 text-center">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No hay eventos registrados
            </h3>
            <p className="text-gray-600 mb-6">
              Comienza creando tu primer evento
            </p>
            <Button onClick={() => router.push("/eventos/nuevo")}>
              <Plus className="mr-2 h-4 w-4" />
              Crear Primer Evento
            </Button>
          </Card>
        )}

        {/* Lista de Eventos */}
        {!isLoading && !error && eventos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {eventos.map((evento) => (
                <EventoCard
                  key={evento.evento_id}
                  evento={evento}
                  onEdit={() => setEditingEvento(evento)}
                  onDelete={() => handleDelete(evento.evento_id)}
                  isDeleting={deletingId === evento.evento_id}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* Modal de Edición */}
      {editingEvento && (
        <EditEventoModal
          evento={editingEvento}
          onClose={() => setEditingEvento(null)}
          onSuccess={handleEditSuccess}
        />
      )}
    </>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  icon: string;
  color: string;
}

function StatCard({ label, value, icon, color }: StatCardProps) {
  return (
    <div className={`${color} rounded-lg p-4 text-center`}>
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-sm font-medium mt-1">{label}</div>
    </div>
  );
}

interface EventoCardProps {
  evento: Evento;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

function EventoCard({ evento, onEdit, onDelete, isDeleting }: EventoCardProps) {
  const estadoConfig = ESTADO_CONFIG[evento.estado];
  const tipoConfig = TIPO_EVENTO_CONFIG[evento.tipo_evento];
  const EstadoIcon = estadoConfig.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full hover:shadow-xl transition-shadow duration-300 border-2 hover:border-[#ff3ea5]/30">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg text-gray-900 truncate">
                {evento.nombre}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xl">{tipoConfig.emoji}</span>
                <span className="text-sm text-gray-600">{tipoConfig.label}</span>
              </div>
            </div>
            <div
              className={`${estadoConfig.bgColor} ${estadoConfig.textColor} px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 whitespace-nowrap`}
            >
              <EstadoIcon className="h-3 w-3" />
              {evento.estado}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Fecha y Hora */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Calendar className="h-4 w-4 text-[#ff3ea5]" />
              <span className="font-medium">
                {new Date(evento.fecha).toLocaleDateString("es-MX", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            {evento.hora && (
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Clock className="h-4 w-4 text-[#ff3ea5]" />
                <span>{evento.hora}</span>
              </div>
            )}
          </div>

          {/* Lugar */}
          {evento.lugar && (
            <div className="flex items-start gap-2 text-sm text-gray-700">
              <MapPin className="h-4 w-4 text-[#ff3ea5] mt-0.5 shrink-0" />
              <span className="line-clamp-2">{evento.lugar}</span>
            </div>
          )}

          {/* Capacidad */}
          {evento.capacidad_total && (
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Users className="h-4 w-4 text-[#ff3ea5]" />
              <span>
                <span className="font-semibold">{evento.capacidad_total}</span>{" "}
                invitados
              </span>
            </div>
          )}

          {/* Descripción */}
          {evento.descripcion && (
            <p className="text-sm text-gray-600 line-clamp-2 pt-2 border-t">
              {evento.descripcion}
            </p>
          )}

          {/* Acciones */}
          <div className="flex gap-2 pt-3 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="flex-1 h-9"
              disabled={isDeleting}
            >
              <Edit className="h-4 w-4 mr-1" />
              Editar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onDelete}
              disabled={isDeleting}
              className="h-9 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
