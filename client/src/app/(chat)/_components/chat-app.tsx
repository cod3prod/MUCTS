"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/zustand/auth-store";
import { useChatStore } from "@/zustand/chat-store";
import ChatRoom from "./chat-room";
import Modal from "@/components/layout/modal";
import Alert from "@/components/layout/modal/alert";
import { io } from "socket.io-client";

export default function ChatApp() {
  const { chatId } = useParams();
  const { isAuthenticated, accessToken, user } = useAuthStore();
  const {
    socket,
    setSocket,
    setParticipants,
    setTitle,
    setChatId,
    addMessage,
  } = useChatStore();

  useEffect(() => {
    if (!accessToken || socket) return;

    const URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000";
    const newSocket = io(URL, {
      auth: {
        token: accessToken,
      },
    });

    newSocket.on("connect", () => {
      console.log("소켓 연결됨");
      setSocket(newSocket);

      if (chatId && user?.id) {
        console.log("joinChat 이벤트 발생", {
          userId: user.id,
          chatId: Number(chatId),
        });
        newSocket.emit("joinChat", {
          userId: user.id,
          chatId: Number(chatId),
        });
      }
    });

    newSocket.on("userJoined", (result) => {
      console.log("userJoined 이벤트 수신:", result);
      if (result) {
        setParticipants(result.participants);
        setTitle(result.title);
        setChatId(result.id);
      }
    });

    newSocket.on("userLeft", (result) => {
      console.log("userLeft 이벤트 수신:", result);
      if (result) {
        setParticipants(result.participants);
      }
    })

    newSocket.on("newMessage", (result) => {
      console.log("newMessage 이벤트 수신:", result);
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

    // 디버깅 용도
    newSocket.onAny((event, ...args) => {
      console.log(`수신된 이벤트: ${event}`, args);
    });

    newSocket.on("error", (error: any) => {
      console.error("Socket error:", error);
    });

    return () => {
      console.log("소켓 연결 해제");
      newSocket.disconnect();
      setSocket(null);
    };
  }, [accessToken, chatId, user?.id]);

  if (!isAuthenticated || !chatId) {
    return null;
  }

  return (
    <>
      <ChatRoom />
      {/* {error && (
        <Modal isOpen={!!error} onClose={() => router.push("/")} title="오류">
          <Alert
            type="error"
            title="오류"
            message={error}
            onConfirm={() => router.push("/")}
          />
        </Modal>
      )} */}
    </>
  );
}
