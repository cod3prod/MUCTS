"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuthStore } from "@/zustand/auth-store";
import { useChatStore } from "@/zustand/chat-store";
import ChatRoom from "./chat-room";
import Modal from "@/components/layout/modal";
import Alert from "@/components/layout/modal/alert";
import { createSocket } from "@/libs/socket";
import RequireLogin from "@/components/ui/require-login";
import { useRouter } from "next/navigation";

export default function ChatApp() {
  const { chatId } = useParams();
  const { isAuthenticated, accessToken, user, setTokens } = useAuthStore();
  const {
    socket,
    setSocket,
    setParticipants,
    setTitle,
    setChatId,
    addMessage,
  } = useChatStore();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!accessToken || !chatId || !user?.id) return;

    const URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000";
    if(!socket) {
      const newSocket = createSocket(URL, accessToken);
      setSocket(newSocket);
      return;
    }

    socket.on("connect", () => {
      console.log("소켓 연결됨");
      setSocket(socket);

      console.log("joinChat 이벤트 발생", {
        userId: user.id,
        chatId: Number(chatId),
      });
      socket.emit("joinChat", {
        userId: user.id,
        chatId: Number(chatId),
      });
    });

    socket.on("userJoined", (result) => {
      console.log("userJoined 이벤트 수신");
      if (result) {
        setParticipants(result.participants);
        setTitle(result.title);
        setChatId(result.id);
      }
    });

    socket.on("userLeft", (result) => {
      console.log("userLeft 이벤트 수신");
      if (result) {
        setParticipants(result.participants);
      }
    });

    socket.on("newMessage", (result) => {
      console.log("newMessage 이벤트 수신");
      if (result) {
        addMessage({
          content: result.content,
          createdAt: result.createdAt,
          sender: {
            id: result.sender.id,
            username: result.sender.username,
            nickname: result.sender.nickname,
          },
        });
      }
    });

    socket.on("chatUpdated", (result) => {
      console.log("chatUpdated 이벤트 수신");
      if (result) {
        setTitle(result.title);
      }
    });

    socket.on("chatDeleted", () => {
      console.log("chatDeleted 이벤트 수신");
      setChatId(null);
      setParticipants([]);
      setTitle("삭제된 채팅입니다.");
    });

    socket.on("tokenExpired", () => {
      console.log("tokenExpired 이벤트 수신");

      socket.emit("refreshToken", {
        refreshToken: localStorage.getItem("refreshToken"),
      });
    });

    socket.on("newTokens", (tokens) => {
      console.log("newTokens 이벤트 수신");
      localStorage.setItem("accessToken", tokens.accessToken);
      localStorage.setItem("refreshToken", tokens.refreshToken);
      
      if(socket) {
        socket.off();
        socket.disconnect();
      }
      
      const newSocket = createSocket(URL, tokens.accessToken);
      setTokens(tokens.accessToken, tokens.refreshToken);
      setSocket(newSocket);
    });

    // 디버깅 용도
    socket.onAny((event, ...args) => {
      console.log(`수신된 이벤트: ${event}`, args);
    });

    socket.on("error", (error: {
      message: string;
      event: string;
    }) => {
      console.error("socket error:", error);
      setError(error.message);
    });

    setSocket(socket);
    return () => {
      console.log("소켓 연결 해제");
      socket.off();
      socket.disconnect();
      setSocket(null);
    };
  }, [socket, accessToken, chatId, user?.id]);

  if (!isAuthenticated || !chatId) {
    return <RequireLogin />;
  }

  return (
    <>
      <ChatRoom />
      {error && (
        <Modal isOpen={!!error} onClose={() => router.push("/")} title="오류">
          <Alert
            type="error"
            title="오류"
            message={error}
            onConfirm={() => router.push("/")}
          />
        </Modal>
      )} 
    </>
  );
}

