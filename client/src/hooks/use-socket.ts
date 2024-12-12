"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { io, Socket } from "socket.io-client";
import {
  SocketEvent,
  ChatResponse,
  DeleteChatResponse,
  ErrorResponse,
  MessageResponse,
  JoinChatRequest,
  LeaveChatRequest,
  SendMessageRequest,
  PatchChatRequest,
  DeleteChatRequest,
} from "@/types/chat";

export default function useSocket(url: string, token: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [chatLog, setChatLog] = useState<MessageResponse[]>([]);
  const [chatInfo, setChatInfo] = useState<ChatResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(url, {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
      setError(null);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("error", (error: ErrorResponse) => {
      setError(error.message);
    });

    socket.on("newMessage", (message: MessageResponse) => {
      setChatLog((prev) => [...prev, message]);
    });

    socket.on("userJoined", (data: ChatResponse) => {
      setChatInfo(data);
    });

    socket.on("userLeft", (data: ChatResponse) => {
      setChatInfo(data);
    });

    socket.on("chatUpdated", (data: ChatResponse) => {
      setChatInfo(data);
    });

    socket.on("chatDeleted", (data: DeleteChatResponse) => {
      setChatLog([]);
      setChatInfo(null);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [url, token]);

  const emit = useCallback(<T>(event: SocketEvent, data: T) => {
    if (!socketRef.current?.connected) {
      setError("소켓이 연결되지 않았습니다");
      return;
    }
    socketRef.current.emit(event, data);
  }, []);

  const joinChat = useCallback((data: JoinChatRequest) => {
    emit("joinChat", data);
  }, [emit]);

  const leaveChat = useCallback((data: LeaveChatRequest) => {
    emit("leaveChat", data);
  }, [emit]);

  const sendMessage = useCallback((data: SendMessageRequest) => {
    emit("sendMessage", data);
  }, [emit]);

  const patchChat = useCallback((data: PatchChatRequest) => {
    emit("patchChat", data);
  }, [emit]);

  const deleteChat = useCallback((data: DeleteChatRequest) => {
    emit("deleteChat", data);
  }, [emit]);

  return {
    isConnected,
    chatLog,
    chatInfo,
    error,
    joinChat,
    leaveChat,
    sendMessage,
    patchChat,
    deleteChat,
  };
}
