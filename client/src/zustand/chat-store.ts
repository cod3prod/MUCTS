import { User } from "@/types/entity";
import { Message } from "@/types/entity"; 
import { Socket } from "socket.io-client";
import { create } from "zustand";

type ChatStore = {
  socket: Socket | null;
  title: string | null;
  createdBy: User | null;
  createdAt: string | null;
  chatId: number | null; 
  participants: User[];
  messages: Message[];
  error: string | null;

  setSocket: (socket: Socket | null) => void;
  setTitle: (title: string | null) => void;
  setChatId: (chatId: number | null) => void;
  setCreatedBy: (createdBy: User | null) => void;
  setCreatedAt: (createdAt: string | null) => void;
  setParticipants: (participants: User[]) => void;
  addParticipant: (participant: User) => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
};

export const useChatStore = create<ChatStore>((set) => ({
  socket: null,
  title: null,
  createdBy: null,
  createdAt: null,
  chatId: null,
  participants: [],
  messages: [],
  error: null,

  setSocket: (socket: Socket | null) => set({ socket }),
  setChatId: (chatId: number | null) => set({ chatId }),
  setTitle: (title: string | null) => set({ title }),
  setCreatedBy: (createdBy: User | null) => set({ createdBy }),
  setCreatedAt: (createdAt: string | null) => set({ createdAt }),
  setParticipants: (participants: User[]) => set({ participants }),
  addParticipant: (participant: User) =>
    set((state) => ({ participants: [...state.participants, participant] })),
  setMessages: (messages: Message[]) => set({ messages }),
  addMessage: (message: Message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setError: (error: string | null) => set({ error }),
}));
