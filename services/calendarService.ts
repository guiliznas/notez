import { auth, getGoogleAccessToken } from "./firebaseConfig";

export interface GoogleCalendarEvent {
  id: string;
  summary: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
}

/**
 * Busca eventos do Google Calendar do usuário
 */
export const fetchCalendarEvents = async (): Promise<GoogleCalendarEvent[]> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.log("[CALENDAR] Usuário não autenticado");
      return [];
    }

    // Obtém o access token do OAuth (não o ID token)
    const token = getGoogleAccessToken();

    if (!token) {
      console.error(
        "[CALENDAR] Access token do Google não encontrado. Faça login novamente."
      );
      return [];
    }

    // Calcula datas para buscar eventos (próximos 7 dias)
    const timeMin = new Date();
    const timeMax = new Date();
    timeMax.setDate(timeMax.getDate() + 7);

    const params = new URLSearchParams({
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      maxResults: "50",
      singleEvents: "true",
      orderBy: "startTime",
    });

    console.log("[CALENDAR] Buscando eventos com access token...");

    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?${params}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      console.error("[CALENDAR] Erro ao buscar eventos:", response.status);
      const errorData = await response.json().catch(() => ({}));
      console.error("[CALENDAR] Detalhes do erro:", errorData);
      return [];
    }

    const data = await response.json();
    console.log("[CALENDAR] Agenda dos proximos dias encontrada");
    return data.items || [];
  } catch (error) {
    console.error("[CALENDAR] Erro ao buscar eventos do calendar:", error);
    return [];
  }
};

/**
 * Formata hora no formato HH:MM
 */
const formatTime = (dateString?: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Determina o label do dia (Hoje, Amanhã, etc)
 */
const getDateLabel = (dateString?: string): string => {
  if (!dateString) return "";

  const eventDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const eventDay = new Date(eventDate);
  eventDay.setHours(0, 0, 0, 0);

  if (eventDay.getTime() === today.getTime()) {
    return "Hoje";
  } else if (eventDay.getTime() === tomorrow.getTime()) {
    return "Amanhã";
  } else {
    return eventDate.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  }
};

/**
 * Converte eventos do Google Calendar para o formato da aplicação
 */
export const convertGoogleEventsToAppFormat = (
  googleEvents: GoogleCalendarEvent[]
) => {
  return googleEvents.map((event) => ({
    id: event.id,
    title: event.summary || "Sem título",
    startTime: formatTime(event.start.dateTime || event.start.date),
    endTime: formatTime(event.end.dateTime || event.end.date),
    dateLabel: getDateLabel(event.start.dateTime || event.start.date),
  }));
};
