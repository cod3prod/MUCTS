"use client";

import { FaRegUser } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import Modal from "@/components/layout/modal";
import EditChatTitle from "@/components/layout/modal/edit-chat-title";
import Alert from "@/components/layout/modal/alert";
import ChatMessage from "./chat-message";
import ChatInput from "./chat-input";
import { useAuthStore } from "@/zustand/auth-store";
import { useChatStore } from "@/zustand/chat-store";
import { useFetch } from "@/hooks/use-fetch";
import { ChatsControllerResponse } from "@/types/api";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ExitButton from "./exit-button";

export default function ChatRoom() {
  const {
    title,
    createdBy,
    createdAt,
    participants,
    messages,
    setTitle,
    setCreatedAt,
    setCreatedBy,
    setParticipants,
    setMessages,
  } = useChatStore();
  const { accessToken, user } = useAuthStore();
  const [data, setData] = useState<ChatsControllerResponse | null>();
  const { fetchWithRetry } = useFetch<ChatsControllerResponse | null>();

  const { chatId } = useParams();
  const fetchData = async () => {
    const result = await fetchWithRetry(
      `${process.env.NEXT_PUBLIC_API_URL}/chats/${chatId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authentication: `Bearer ${accessToken}`,
        },
      }
    );
    setData(result);
  };

  useEffect(() => {
    fetchData();
  }, [chatId]);

  useEffect(() => {
    console.log("chatRoom fetch test", data);
    const chatInfo = data?.chat;
    setTitle(chatInfo?.title || null);
    setParticipants(chatInfo?.participants || []);
    setMessages(chatInfo?.messages || []);
    setCreatedAt(chatInfo?.createdAt || null);
    setCreatedBy(chatInfo?.createdBy || null);
  }, [data]);

  // todo data가 null일 때 처리해줄 거 만들기

  return (
    <>
      <div className="h-[calc(100vh-200px)] max-w-4xl mx-auto flex flex-col bg-white rounded-xl shadow-lg">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <ExitButton />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold">{title}</h1>
                {createdBy === user?.id && (
                  <button
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="채팅방 제목 수정"
                  >
                    <FaEdit className="w-4 h-4 text-gray-500" />
                  </button>
                )}
              </div>
              <p className="mt-1 text-sm text-gray-500">
                {new Date(
                  createdAt || new Date().toISOString()
                ).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-gray-500">
            <FaRegUser className="w-5 h-5" />
            <span>{participants.length}</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              message={message.content}
              sender={message.sender.nickname || "탈퇴한 사용자"}
              isMine={message.sender.id === user?.id}
            />
          ))}
        </div>

        <ChatInput />
      </div>

      {/* <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="채팅방 제목 수정"
      >
        <EditChatTitle
          currentTitle={chatInfo.title}
          onSubmit={handleEditTitle}
          onCancel={() => setIsEditModalOpen(false)}
          isCreator={chatInfo.createdBy.id === user.id}
        />
      </Modal>

      <Modal
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        title="알림"
      >
        <Alert
          type="error"
          title="오류"
          message={alertMessage}
          onConfirm={() => setShowAlert(false)}
        />
      </Modal> */}
    </>
  );
}
