import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Group, Message, CalendarEvent, User } from "../types";
import { auth, db, signInWithGoogle, logout } from "../services/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import {
  fetchCalendarEvents,
  convertGoogleEventsToAppFormat,
} from "../services/calendarService";

interface AppContextType {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  groups: Group[];
  messages: Message[];
  events: CalendarEvent[];
  getMessagesByGroupId: (groupId: string) => Message[];
  addMessage: (groupId: string, text: string) => void;
  updateMessage: (messageId: string, text: string) => void;
  deleteMessage: (messageId: string) => void;
  createGroup: (title: string, initialNote?: string) => string; // returns new group ID
  archiveGroup: (groupId: string) => void;
  updateGroupTitle: (groupId: string, newTitle: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial Mock Data (used for guests)
const INITIAL_GROUPS: Group[] = [
  {
    id: "1",
    title: "Ideias de Projetos",
    lastActive: Date.now() - 1000 * 60 * 30,
    snippet: "Precisamos validar a API...",
    isArchived: false,
  },
  {
    id: "2",
    title: "Tarefas de Casa",
    lastActive: Date.now() - 1000 * 60 * 60 * 24,
    snippet: "Comprar leite e ovos",
    isArchived: false,
  },
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: "m1",
    groupId: "1",
    text: "Bom dia! Vamos revisar o material de hoje.",
    senderId: "other",
    timestamp: Date.now() - 1000000,
  },
  {
    id: "m2",
    groupId: "1",
    text: "Claro, estou pronto.",
    senderId: "me",
    timestamp: Date.now() - 900000,
  },
];

const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: "e1",
    title: "Reunião de planejamento",
    startTime: "10:00",
    endTime: "11:00",
    dateLabel: "Hoje",
  },
  {
    id: "e2",
    title: "Sessão de brainstorming",
    startTime: "14:00",
    endTime: "15:00",
    dateLabel: "Hoje",
  },
  {
    id: "e3",
    title: "Revisão de design",
    startTime: "16:00",
    endTime: "17:00",
    dateLabel: "Hoje",
  },
  {
    id: "e4",
    title: "Almoço com equipe",
    startTime: "12:00",
    endTime: "13:00",
    dateLabel: "Amanhã",
  },
];

export const AppProvider = ({ children }: { children?: ReactNode }) => {
  console.log("[APPCONTEXT] Inicializando AppProvider");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // State is local by default (Guest Mode)
  const [groups, setGroups] = useState<Group[]>(INITIAL_GROUPS);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_EVENTS);

  // Sync Firestore subscriptions
  useEffect(() => {
    console.log("[APPCONTEXT] Configurando listener de autenticação");
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      console.log(
        "[APPCONTEXT] Auth state changed:",
        firebaseUser ? "Usuário logado" : "Usuário não logado"
      );
      if (firebaseUser) {
        const updatedUser = {
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
        };
        setUser(updatedUser);

        // If logged in, subscribe to Firestore data
        subscribeToUserData(firebaseUser.uid);

        // Simulate fetching calendar events for logged in user
        mockCalendarFetch(firebaseUser.uid);
      } else {
        setUser(null);
        console.log("[APPCONTEXT] Usuário não autenticado, usando modo guest");
        // Reset to initial local state if logged out
        setGroups(INITIAL_GROUPS);
        setMessages(INITIAL_MESSAGES);
        setEvents(INITIAL_EVENTS);
      }
      console.log("[APPCONTEXT] Loading concluído");
      setLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  const subscribeToUserData = (uid: string) => {
    console.log("[APPCONTEXT] Inscrevendo dados do Firestore para UID:", uid);

    // Groups Subscription
    const qGroups = query(collection(db, "groups"), where("userId", "==", uid));
    const unsubGroups = onSnapshot(
      qGroups,
      (snapshot) => {
        console.log(
          "[FIRESTORE] Groups snapshot recebido:",
          snapshot.size,
          "documentos"
        );
        const fetchedGroups: Group[] = [];
        snapshot.forEach((doc) => {
          fetchedGroups.push({ id: doc.id, ...doc.data() } as Group);
        });
        // Sort by last active locally for UI
        fetchedGroups.sort((a, b) => b.lastActive - a.lastActive);
        setGroups(fetchedGroups);
      },
      (error) => {
        console.error("[FIRESTORE] Erro ao buscar groups:", error);
      }
    );

    // Messages Subscription
    const qMessages = query(
      collection(db, "messages"),
      where("userId", "==", uid)
    );
    const unsubMessages = onSnapshot(
      qMessages,
      (snapshot) => {
        console.log(
          "[FIRESTORE] Messages snapshot recebido:",
          snapshot.size,
          "documentos"
        );
        const fetchedMessages: Message[] = [];
        snapshot.forEach((doc) => {
          fetchedMessages.push({ id: doc.id, ...doc.data() } as Message);
        });
        setMessages(fetchedMessages);
      },
      (error) => {
        console.error("[FIRESTORE] Erro ao buscar messages:", error);
      }
    );

    return () => {
      unsubGroups();
      unsubMessages();
    };
  };

  const mockCalendarFetch = async (uid: string) => {
    console.log("[APPCONTEXT] Buscando eventos do Google Calendar...");
    try {
      const googleEvents = await fetchCalendarEvents();
      console.log(
        "[APPCONTEXT] Eventos do Google Calendar recebidos:",
        googleEvents.length
      );

      if (googleEvents.length > 0) {
        const appEvents = convertGoogleEventsToAppFormat(googleEvents);
        setEvents(appEvents);
      } else {
        // Se não houver eventos, mantém os eventos iniciais
        setEvents(INITIAL_EVENTS);
      }
    } catch (error) {
      console.error("[APPCONTEXT] Erro ao buscar eventos do calendar:", error);
      // Em caso de erro, usa eventos mock
      setEvents(INITIAL_EVENTS);
    }
  };

  const signIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const signOut = async () => {
    try {
      await logout();
      setUser(null);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const getMessagesByGroupId = (groupId: string) => {
    return messages
      .filter((m) => m.groupId === groupId)
      .sort((a, b) => a.timestamp - b.timestamp);
  };

  const addMessage = async (groupId: string, text: string) => {
    const newMessage: any = {
      groupId,
      text,
      senderId: "me",
      timestamp: Date.now(),
      userId: user?.uid,
    };

    if (user) {
      // Firestore
      await addDoc(collection(db, "messages"), newMessage);
      await updateDoc(doc(db, "groups", groupId), {
        lastActive: Date.now(),
        snippet: text,
      });
    } else {
      // Local State
      newMessage.id = Date.now().toString();
      setMessages((prev) => [...prev, newMessage]);
      setGroups((prev) =>
        prev
          .map((g) => {
            if (g.id === groupId) {
              return { ...g, lastActive: Date.now(), snippet: text };
            }
            return g;
          })
          .sort((a, b) => b.lastActive - a.lastActive)
      );
    }
  };

  const updateMessage = async (messageId: string, text: string) => {
    if (user) {
      if (messageId.length > 15) {
        await updateDoc(doc(db, "messages", messageId), { text });
      }
    } else {
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, text } : m))
      );
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (user) {
      if (messageId.length > 15) {
        await deleteDoc(doc(db, "messages", messageId));
      }
    } else {
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
    }
  };

  const createGroup = (title: string, initialNote?: string): string => {
    const timestamp = Date.now();

    if (user) {
      const newGroupRef = doc(collection(db, "groups"));
      const newGroupId = newGroupRef.id;

      // Optimistic update not really needed as we subscribe, but return ID is immediate.
      // We set the doc with the generated ID.
      setDoc(newGroupRef, {
        id: newGroupId,
        title: title || "Novo Grupo",
        lastActive: timestamp,
        snippet: initialNote || "",
        isArchived: false,
        userId: user.uid,
      });

      if (initialNote) {
        addDoc(collection(db, "messages"), {
          groupId: newGroupId,
          text: initialNote,
          senderId: "me",
          timestamp: timestamp,
          userId: user.uid,
        });
      }
      return newGroupId;
    } else {
      const newGroupId = timestamp.toString();
      const newGroup: Group = {
        id: newGroupId,
        title: title || "Novo Grupo",
        lastActive: timestamp,
        snippet: initialNote || "",
        isArchived: false,
      };
      setGroups((prev) => [newGroup, ...prev]);

      if (initialNote) {
        const newMessage: Message = {
          id: timestamp.toString() + "m",
          groupId: newGroupId,
          text: initialNote,
          senderId: "me",
          timestamp: timestamp,
        };
        setMessages((prev) => [...prev, newMessage]);
      }
      return newGroupId;
    }
  };

  const archiveGroup = async (groupId: string) => {
    if (user) {
      await updateDoc(doc(db, "groups", groupId), { isArchived: true });
    } else {
      setGroups((prev) =>
        prev.map((g) => (g.id === groupId ? { ...g, isArchived: true } : g))
      );
    }
  };

  const updateGroupTitle = async (groupId: string, newTitle: string) => {
    if (user) {
      await updateDoc(doc(db, "groups", groupId), { title: newTitle });
    } else {
      setGroups((prev) =>
        prev.map((g) => (g.id === groupId ? { ...g, title: newTitle } : g))
      );
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signOut,
    groups,
    messages,
    events,
    getMessagesByGroupId,
    addMessage,
    updateMessage,
    deleteMessage,
    createGroup,
    archiveGroup,
    updateGroupTitle,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
