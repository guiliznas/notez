export interface User {
    uid: string;
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
}

export interface Message {
    id: string;
    groupId: string;
    text: string;
    senderId: string; // 'me', 'system', or user id
    timestamp: number; // Unix timestamp
    isSystem?: boolean;
    userId?: string; // Owner of the message
}

export interface Group {
    id: string;
    title: string;
    lastActive: number; // Timestamp of last message
    snippet: string; // Last message preview
    isArchived?: boolean;
    userId?: string; // Owner of the group
}

export interface CalendarEvent {
    id: string;
    title: string;
    startTime: string; // HH:MM format for display
    endTime: string;
    dateLabel: string; // e.g., "Hoje", "Amanhã"
}

export enum AppTab {
    GROUPS = 'groups',
    QUICK_NOTE = 'quick_note',
    AGENDA = 'agenda',
    SETTINGS = 'settings'
}