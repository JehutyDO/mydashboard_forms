import EventoForm from "@/components/eventos/EventoForm";

export default function NuevoEventoPage() {
  return (
    <main className="min-h-screen bg-linear-to-br from-pink-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <EventoForm />
      </div>
    </main>
  );
}
