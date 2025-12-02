import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar, Users, MapPin, Clock } from "lucide-react";
import { getEventos } from "@/lib/api/eventos.service";
import type { Evento } from "@/lib/types/evento.types";

export default async function HomePage() {
  // Obtener estadísticas reales
  let eventos: Evento[] = [];
  const stats = {
    totalEventos: 0,
    invitadosGestionados: 0,
    eventosActivos: 0,
  };

  try {
    eventos = await getEventos();
    stats.totalEventos = eventos.length;
    stats.invitadosGestionados = eventos.reduce(
      (sum, evento) => sum + Number(evento.capacidad_total || 0),
      0
    );
    stats.eventosActivos = eventos.filter(
      (e) => e.estado === "activo"
    ).length;
  } catch (error) {
    console.error("Error al cargar estadísticas:", error);
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k+`;
    }
    return `${num}+`;
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-blue-50 via-white to-cyan-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto space-y-8">
          {/* Logo/Title */}
          <div className="space-y-4">
            <h1 className="text-6xl font-bold bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Pixeles Events
            </h1>
            <p className="text-2xl text-gray-600">
              Sistema de Gestión de Eventos Premium
            </p>
          </div>

          {/* Description */}
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Crea y gestiona eventos inolvidables con nuestra plataforma profesional.
            Desde bodas hasta eventos corporativos, todo en un solo lugar.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link href="/eventos/nuevo">
              <Button size="lg" className="h-14 px-8 text-lg w-full sm:w-auto">
                <Calendar className="mr-2 h-5 w-5" />
                Crear Nuevo Evento
              </Button>
            </Link>
            <Link href="/eventos">
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-lg w-full sm:w-auto border-2 border-gray-300 bg-white text-gray-900 hover:border-[#3b82f6] hover:text-[#3b82f6] transition-all font-semibold"
              >
                <Users className="mr-2 h-5 w-5" />
                Ver Todos los Eventos
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
          <FeatureCard
            icon={<Calendar className="h-8 w-8 text-[#3b82f6]" />}
            title="Gestión Completa"
            description="Administra todos los detalles de tus eventos en un solo lugar"
          />
          <FeatureCard
            icon={<Users className="h-8 w-8 text-[#3b82f6]" />}
            title="Control de Asistentes"
            description="Gestiona la capacidad y lista de invitados fácilmente"
          />
          <FeatureCard
            icon={<MapPin className="h-8 w-8 text-[#3b82f6]" />}
            title="Múltiples Ubicaciones"
            description="Organiza eventos en diferentes lugares sin complicaciones"
          />
          <FeatureCard
            icon={<Clock className="h-8 w-8 text-[#3b82f6]" />}
            title="Programación Flexible"
            description="Planifica eventos con fechas y horarios personalizados"
          />
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <StatCard
            number={formatNumber(stats.totalEventos)}
            label="Eventos Creados"
          />
          <StatCard
            number={formatNumber(stats.invitadosGestionados)}
            label="Invitados Gestionados"
          />
          <StatCard
            number={`${stats.eventosActivos}`}
            label="Eventos Activos"
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-20 bg-blue-50">
        <div className="container mx-auto px-4 py-8 text-center text-gray-600">
          <p>© 2025 Pixeles Events. Todos los derechos reservados.</p>
          <p className="mt-2 text-sm">
            Powered by <span className="text-[#3b82f6] font-semibold">Pixeles</span>
          </p>
        </div>
      </footer>
    </main>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="p-3 bg-blue-50 rounded-lg">
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}

interface StatCardProps {
  number: string;
  label: string;
}

function StatCard({ number, label }: StatCardProps) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
      <p className="text-4xl font-bold bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
        {number}
      </p>
      <p className="text-gray-600 mt-2">{label}</p>
    </div>
  );
}
