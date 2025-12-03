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
  Search,
  Filter,
  Grid3x3,
  List,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getEventos, deleteEvento } from "@/lib/api/eventos.service";
import type { Evento } from "@/lib/types/evento.types";
import EditEventoModal from "@/components/eventos/EditEventoModal";
import { formatTime12h } from "@/lib/utils/timeutils";

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

type ViewMode = "grid" | "list";
type TipoEvento = "boda" | "xv" | "cumpleaños" | "corporativo" | "otro" | "todos";
type EstadoEvento = "borrador" | "activo" | "finalizado" | "todos";

export default function EventosLista() {
  const router = useRouter();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [filteredEventos, setFilteredEventos] = useState<Evento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingEvento, setEditingEvento] = useState<Evento | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState<TipoEvento>("todos");
  const [estadoFiltro, setEstadoFiltro] = useState<EstadoEvento>("todos");
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = viewMode === "grid" ? 9 : 10;

  const loadEventos = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getEventos();
      setEventos(response);
      setFilteredEventos(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar eventos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEventos();
  }, []);

  // Aplicar filtros
  useEffect(() => {
    let resultado = [...eventos];

    // Filtro de búsqueda
    if (searchTerm) {
      resultado = resultado.filter(
        (evento) =>
          evento.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          evento.lugar?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          evento.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por tipo
    if (tipoFiltro !== "todos") {
      resultado = resultado.filter((evento) => evento.tipo_evento === tipoFiltro);
    }

    // Filtro por estado
    if (estadoFiltro !== "todos") {
      resultado = resultado.filter((evento) => evento.estado === estadoFiltro);
    }

    setFilteredEventos(resultado);
    setCurrentPage(1); // Reset a la primera página al cambiar filtros
  }, [searchTerm, tipoFiltro, estadoFiltro, eventos]);
  
  // Resetear página al cambiar modo de vista
  useEffect(() => {
    setCurrentPage(1);
  }, [viewMode]);

  // Calcular paginación
  const totalPages = Math.ceil(filteredEventos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEventos = filteredEventos.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

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
    total: filteredEventos.length,
    activos: filteredEventos.filter((e) => e.estado === "activo").length,
    borradores: filteredEventos.filter((e) => e.estado === "borrador").length,
    finalizados: filteredEventos.filter((e) => e.estado === "finalizado").length,
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-7xl mx-auto space-y-6 px-4 py-6"
      >
        {/* Header */}
        <Card className="shadow-xl border-0 bg-linear-to-br from-white to-blue-50/30">
          <CardHeader className="pb-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
              <div>
                <CardTitle className="text-4xl font-extrabold bg-linear-to-r from-blue-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent mb-2">
                  Gestión de Eventos
                </CardTitle>
                <p className="text-gray-600 font-medium text-base">
                  {filteredEventos.length} evento{filteredEventos.length !== 1 ? "s" : ""} encontrado{filteredEventos.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <Button
                  variant="outline"
                  onClick={() => router.push("/")}
                  className="flex-1 sm:flex-initial h-11 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Inicio
                </Button>
                <Button
                  onClick={() => router.push("/eventos/nuevo")}
                  className="flex-1 sm:flex-initial h-11 bg-linear-to-r from-[#3b82f6] to-[#2563eb] hover:from-[#2563eb] hover:to-[#1d4ed8] shadow-md hover:shadow-lg transition-all font-semibold"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Nuevo Evento
                </Button>
              </div>
            </div>
          </CardHeader>

          {/* Estadísticas */}
          <CardContent className="pt-0 pb-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
              <StatCard
                label="Total"
                value={stats.total}
                icon="📊"
                color="bg-blue-100 text-blue-800"
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
                color="bg-cyan-100 text-cyan-800"
              />
            </div>
          </CardContent>
        </Card>

        {/* Filtros y Búsqueda */}
        <Card className="shadow-lg border-0">
          <CardContent className="p-6">
            <div className="space-y-5">
              {/* Búsqueda */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <Search className="h-4 w-4 text-[#3b82f6]" />
                  Buscar eventos
                </label>
                <input
                  type="text"
                  placeholder="Buscar por nombre, lugar o descripción..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:border-[#3b82f6] transition-all text-sm"
                />
              </div>

              {/* Filtros */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* Filtro por tipo */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <Filter className="h-4 w-4 text-[#3b82f6]" />
                    Tipo de evento
                  </label>
                  <select
                    value={tipoFiltro}
                    onChange={(e) => setTipoFiltro(e.target.value as TipoEvento)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:border-[#3b82f6] transition-all text-sm font-medium"
                  >
                    <option value="todos">Todos los tipos</option>
                    <option value="boda">💒 Bodas</option>
                    <option value="xv">👑 XV Años</option>
                    <option value="cumpleaños">🎂 Cumpleaños</option>
                    <option value="corporativo">💼 Corporativos</option>
                    <option value="otro">🎉 Otros</option>
                  </select>
                </div>

                {/* Filtro por estado */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <CheckCircle2 className="h-4 w-4 text-[#3b82f6]" />
                    Estado
                  </label>
                  <select
                    value={estadoFiltro}
                    onChange={(e) => setEstadoFiltro(e.target.value as EstadoEvento)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:border-[#3b82f6] transition-all text-sm font-medium"
                  >
                    <option value="todos">Todos los estados</option>
                    <option value="borrador">📝 Borrador</option>
                    <option value="activo">✅ Activo</option>
                    <option value="finalizado">🏁 Finalizado</option>
                  </select>
                </div>

                {/* Selector de vista */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <Grid3x3 className="h-4 w-4 text-[#3b82f6]" />
                    Vista
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`flex-1 h-11 font-semibold transition-all border-2 rounded-lg flex items-center justify-center ${
                        viewMode === "grid"
                          ? "bg-[#3b82f6] hover:bg-[#2563eb] text-white border-[#3b82f6] shadow-md"
                          : "bg-white text-gray-900 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                      }`}
                    >
                      <Grid3x3 className="h-4 w-4 mr-2" />
                      Grid
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`flex-1 h-11 font-semibold transition-all border-2 rounded-lg flex items-center justify-center ${
                        viewMode === "list"
                          ? "bg-[#3b82f6] hover:bg-[#2563eb] text-white border-[#3b82f6] shadow-md"
                          : "bg-white text-gray-900 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                      }`}
                    >
                      <List className="h-4 w-4 mr-2" />
                      Lista
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <Card className="p-12 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-[#3b82f6] mx-auto mb-4" />
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
        {!isLoading && !error && filteredEventos.length === 0 && (
          <Card className="p-12 text-center">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {eventos.length === 0
                ? "No hay eventos registrados"
                : "No se encontraron eventos"}
            </h3>
            <p className="text-gray-600 mb-6">
              {eventos.length === 0
                ? "Comienza creando tu primer evento"
                : "Intenta ajustar los filtros de búsqueda"}
            </p>
            {eventos.length === 0 && (
              <Button
                onClick={() => router.push("/eventos/nuevo")}
                className="bg-[#3b82f6] hover:bg-[#2563eb]"
              >
                <Plus className="mr-2 h-4 w-4" />
                Crear Primer Evento
              </Button>
            )}
          </Card>
        )}

        {/* Lista de Eventos */}
        {!isLoading && !error && filteredEventos.length > 0 && (
          <>
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
                  : "space-y-4"
              }
            >
              <AnimatePresence mode="popLayout">
                {paginatedEventos.map((evento) => (
                  <EventoCard
                    key={evento.evento_id}
                    evento={evento}
                    onEdit={() => setEditingEvento(evento)}
                    onDelete={() => handleDelete(evento.evento_id)}
                    isDeleting={deletingId === evento.evento_id}
                    viewMode={viewMode}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Info de página */}
                    <div className="text-sm text-gray-600 font-medium">
                      Mostrando <span className="font-bold text-[#3b82f6]">{startIndex + 1}</span> a{" "}
                      <span className="font-bold text-[#3b82f6]">{Math.min(endIndex, filteredEventos.length)}</span> de{" "}
                      <span className="font-bold text-[#3b82f6]">{filteredEventos.length}</span> eventos
                    </div>

                    {/* Controles de paginación */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="h-9 px-3 hover:bg-blue-50 hover:border-[#3b82f6] hover:text-[#3b82f6] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>

                      {/* Números de página */}
                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                          // Mostrar solo páginas cercanas a la actual
                          if (
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                          ) {
                            return (
                              <Button
                                key={page}
                                variant={page === currentPage ? "default" : "outline"}
                                size="sm"
                                onClick={() => goToPage(page)}
                                className={`h-9 w-9 p-0 font-semibold ${
                                  page === currentPage
                                    ? "bg-[#3b82f6] hover:bg-[#2563eb] text-white"
                                    : "hover:bg-blue-50 hover:border-[#3b82f6] hover:text-[#3b82f6]"
                                }`}
                              >
                                {page}
                              </Button>
                            );
                          } else if (page === currentPage - 2 || page === currentPage + 2) {
                            return (
                              <span key={page} className="px-2 text-gray-400 font-medium">
                                ...
                              </span>
                            );
                          }
                          return null;
                        })}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="h-9 px-3 hover:bg-blue-50 hover:border-[#3b82f6] hover:text-[#3b82f6] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
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
    <div className={`${color} rounded-2xl p-6 text-center hover:scale-105 transition-all duration-200 shadow-md hover:shadow-xl aspect-square flex flex-col items-center justify-center`}>
      <div className="text-4xl mb-3">{icon}</div>
      <div className="text-5xl font-extrabold mb-2">{value}</div>
      <div className="text-xs font-bold uppercase tracking-wider">{label}</div>
    </div>
  );
}

interface EventoCardProps {
  evento: Evento;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
  viewMode: ViewMode;
}

function EventoCard({ evento, onEdit, onDelete, isDeleting, viewMode }: EventoCardProps) {
  // Normalizar el estado a minúsculas para evitar problemas con la BD
  const estadoNormalizado = evento.estado?.toLowerCase() as 'borrador' | 'activo' | 'finalizado';
  const tipoNormalizado = evento.tipo_evento?.toLowerCase() as 'boda' | 'xv' | 'cumpleaños' | 'corporativo' | 'otro';
  
  const estadoConfig = ESTADO_CONFIG[estadoNormalizado] || ESTADO_CONFIG.borrador;
  const tipoConfig = TIPO_EVENTO_CONFIG[tipoNormalizado] || TIPO_EVENTO_CONFIG.otro;
  const EstadoIcon = estadoConfig.icon;

  if (viewMode === "list") {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-[#3b82f6]/40 rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center gap-5">
              {/* Info principal */}
              <div className="flex-1 min-w-0 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-1">
                      {evento.nombre}
                    </h3>
                    {/* Involucrados */}
                    {evento.nombre_involucrado_1 && (
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm font-medium text-gray-700">
                          👥 {evento.nombre_involucrado_1}
                          {evento.nombre_involucrado_2 && (
                            <span className="text-gray-500"> & {evento.nombre_involucrado_2}</span>
                          )}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{tipoConfig.emoji}</span>
                      <span className="text-sm font-semibold text-gray-600">{tipoConfig.label}</span>
                    </div>
                  </div>
                  <div
                    className={`${estadoConfig.bgColor} ${estadoConfig.textColor} px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0 shadow-sm`}
                  >
                    <EstadoIcon className="h-3.5 w-3.5" />
                    {evento.estado.toUpperCase()}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="flex items-center gap-3 text-sm text-gray-700 bg-blue-50/50 rounded-xl p-3">
                    <div className="bg-[#3b82f6] rounded-lg p-2 shrink-0">
                      <Calendar className="h-3.5 w-3.5 text-white" />
                    </div>
                    <span className="font-semibold">
                      {new Date(evento.fecha).toLocaleDateString("es-MX", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  {evento.hora && (
                    <div className="flex items-center gap-3 text-sm text-gray-700 bg-blue-50/50 rounded-xl p-3">
                      <div className="bg-[#3b82f6] rounded-lg p-2 shrink-0">
                        <Clock className="h-3.5 w-3.5 text-white" />
                      </div>
                      <span className="font-bold text-[#3b82f6]">{formatTime12h(evento.hora)}</span>
                    </div>
                  )}
                  {evento.capacidad_total && (
                    <div className="flex items-center gap-3 text-sm text-gray-700 bg-green-50/50 rounded-xl p-3">
                      <div className="bg-green-600 rounded-lg p-2 shrink-0">
                        <Users className="h-3.5 w-3.5 text-white" />
                      </div>
                      <span><span className="font-bold text-gray-900">{evento.capacidad_total}</span> invitados</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Acciones */}
              <div className="flex lg:flex-col gap-2.5 lg:w-32 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onEdit}
                  className="flex-1 lg:w-full h-11 hover:bg-blue-50 hover:border-[#3b82f6] hover:text-[#3b82f6] font-semibold rounded-xl transition-all"
                  disabled={isDeleting}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onDelete}
                  disabled={isDeleting}
                  className="flex-1 lg:w-full h-11 text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300 font-semibold rounded-xl transition-all"
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Eliminar
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card className="h-full hover:shadow-2xl transition-all duration-300 border-2 hover:border-[#3b82f6]/50 flex flex-col rounded-2xl overflow-hidden">
        <CardHeader className="pb-4 pt-6 px-6 bg-linear-to-br from-white to-gray-50/50">
          <div className="flex justify-between items-start gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-xl text-gray-900 mb-2 leading-tight line-clamp-2">
                {evento.nombre}
              </h3>
              {/* Involucrados */}
              {evento.nombre_involucrado_1 && (
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-medium text-gray-700 line-clamp-1">
                    👥 {evento.nombre_involucrado_1}
                    {evento.nombre_involucrado_2 && (
                      <span className="text-gray-500"> & {evento.nombre_involucrado_2}</span>
                    )}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2.5">
                <span className="text-3xl">{tipoConfig.emoji}</span>
                <span className="text-sm font-semibold text-gray-600">{tipoConfig.label}</span>
              </div>
            </div>
            <div
              className={`${estadoConfig.bgColor} ${estadoConfig.textColor} px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0 shadow-sm`}
            >
              <EstadoIcon className="h-3.5 w-3.5" />
              {evento.estado.toUpperCase()}
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col space-y-4 px-6 pb-6">
          {/* Fecha y Hora */}
          <div className="space-y-3 bg-blue-50/50 rounded-xl p-4">
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <div className="bg-[#3b82f6] rounded-lg p-2 shrink-0">
                <Calendar className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold">
                {new Date(evento.fecha).toLocaleDateString("es-MX", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            {evento.hora && (
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <div className="bg-[#3b82f6] rounded-lg p-2 shrink-0">
                  <Clock className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold text-[#3b82f6] text-base">{formatTime12h(evento.hora)}</span>
              </div>
            )}
          </div>

          {/* Lugar */}
          {evento.lugar && (
            <div className="flex items-start gap-3 text-sm text-gray-700 bg-gray-50 rounded-xl p-4">
              <div className="bg-[#3b82f6] rounded-lg p-2 shrink-0 mt-0.5">
                <MapPin className="h-4 w-4 text-white" />
              </div>
              <span className="line-clamp-2 leading-relaxed font-medium pt-1">{evento.lugar}</span>
            </div>
          )}

          {/* Capacidad */}
          {evento.capacidad_total && (
            <div className="flex items-center gap-3 text-sm text-gray-700 bg-green-50/50 rounded-xl p-4">
              <div className="bg-green-600 rounded-lg p-2 shrink-0">
                <Users className="h-4 w-4 text-white" />
              </div>
              <span>
                <span className="font-bold text-gray-900 text-lg">{evento.capacidad_total}</span>{" "}
                <span className="text-gray-600 font-medium">invitados</span>
              </span>
            </div>
          )}

          {/* Descripción */}
          {evento.descripcion && (
            <div className="pt-2">
              <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                {evento.descripcion}
              </p>
            </div>
          )}

          {/* Acciones */}
          <div className="flex gap-2.5 pt-4 mt-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="flex-1 h-11 hover:bg-blue-50 hover:border-[#3b82f6] hover:text-[#3b82f6] font-semibold transition-all rounded-xl"
              disabled={isDeleting}
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onDelete}
              disabled={isDeleting}
              className="h-11 px-4 text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300 font-semibold transition-all rounded-xl"
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
