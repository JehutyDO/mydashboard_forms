// src/lib/api/eventos.service.ts

import { fetcher } from "@/lib/utils/fetcher";
import type { 
  Evento,
  EventoFormData, 
  EventoResponse
} from "@/lib/types/evento.types";

/**
 * Crea un nuevo evento
 */
export async function createEvento(
  data: EventoFormData
): Promise<EventoResponse> {
  try {
    const response = await fetcher<EventoResponse>("/eventos.php", {
      method: "POST",
      body: data,
    });
    return response;
  } catch (error) {
    console.error("Error al crear evento:", error);
    throw error;
  }
}

/**
 * Obtiene todos los eventos
 */
export async function getEventos(): Promise<Evento[]> {
  try {
    const response = await fetcher<Evento[]>("/eventos.php", {
      method: "GET",
    });
    return response;
  } catch (error) {
    console.error("Error al obtener eventos:", error);
    throw error;
  }
}

/**
 * Obtiene un evento por ID
 */
export async function getEventoById(id: number): Promise<EventoResponse> {
  try {
    const response = await fetcher<EventoResponse>(`/eventos.php?id=${id}`, {
      method: "GET",
    });
    return response;
  } catch (error) {
    console.error(`Error al obtener evento ${id}:`, error);
    throw error;
  }
}

/**
 * Actualiza un evento existente
 */
export async function updateEvento(
  id: number,
  data: Partial<EventoFormData>
): Promise<{ success: boolean }> {
  try {
    const response = await fetcher<{ success: boolean }>(`/eventos.php?id=${id}`, {
      method: "PUT",
      body: data,
    });
    return response;
  } catch (error) {
    console.error(`Error al actualizar evento ${id}:`, error);
    throw error;
  }
}

/**
 * Elimina un evento
 */
export async function deleteEvento(id: number): Promise<{ success: boolean }> {
  try {
    const response = await fetcher<{ success: boolean }>(`/eventos.php?id=${id}`, {
      method: "DELETE",
    });
    return response;
  } catch (error) {
    console.error(`Error al eliminar evento ${id}:`, error);
    throw error;
  }
}
