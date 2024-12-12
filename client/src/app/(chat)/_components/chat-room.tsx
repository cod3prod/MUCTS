"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { FaRegUser } from "react-icons/fa6";
import { IoArrowBack } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import ChatMessage from "./chat-message";
import ChatInput from "./chat-input";
import useSocket from "@/hooks/use-socket";
import { ChatRoomProps } from "@/types/chat";
import Modal from "@/components/layout/modal";
import EditChatTitle from "@/components/layout/modal/edit-chat-title";
import Alert from "@/components/layout/modal/alert";

export default function ChatRoom({ chatId, userId, token }: ChatRoomProps) {
  const router = useRouter();
  const messageEndRef = useRef<HTMLDivElement>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  
  const { 
    isConnected, 
    chatLog, 
    chatInfo, 
    error,
    joinChat,
    leaveChat,
    sendMessage,
    patchChat 
  } = useSocket(
    process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000",
    token
  );

  const scrollToBottom = useCallback(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isConnected) {
      joinChat({ userId, chatId });
    }
    return () => {
      if (isConnected) {
        leaveChat({ userId, chatId });
      }
    };
  }, [isConnected, userId, chatId, joinChat, leaveChat]);

  useEffect(() => {
    scrollToBottom();
  }, [chatLog, scrollToBottom]);

  useEffect(() => {
    if (error) {
      setAlertMessage(error);
      setShowAlert(true);
      router.push('/');
    }
  }, [error, router]);

  const handleExit = useCallback(() => {
    leaveChat({ userId, chatId });
    router.push('/');
  }, [leaveChat, userId, chatId, router]);

  const handleSendMessage = useCallback((content: string) => {
    if (!content.trim()) return;
    
    sendMessage({
      chatId,
      content,
      senderId: userId,
    });
  }, [chatId, userId, sendMessage]);

  const handleEditTitle = useCallback((newTitle: string) => {
    if (!chatInfo || chatInfo.createdBy.id !== userId) {
      setAlertMessage("채팅방 제목은 방장만 수정할 수 있습니다.");
      setShowAlert(true);
      return;
    }
    
    patchChat({
      id: chatId,
      patchChatDto: {
        title: newTitle
      }
    });
    setIsEditModalOpen(false);
  }, [chatId, chatInfo, userId, patchChat]);

  if (!chatInfo) return null;

  return (
    <>
      <div className="h-[calc(100vh-200px)] max-w-4xl mx-auto flex flex-col bg-white rounded-xl shadow-lg">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <button
              onClick={handleExit}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="나가기"
            >
              <IoArrowBack className="w-5 h-5 text-gray-500" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold">{chatInfo.title}</h1>
                {chatInfo.createdBy.id === userId && (
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="채팅방 제목 수정"
                  >
                    <FaEdit className="w-4 h-4 text-gray-500" />
                  </button>
                )}
              </div>
              <p className="mt-1 text-sm text-gray-500">
                {new Date(chatInfo.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-gray-500">
            <FaRegUser className="w-5 h-5" />
            <span>{chatInfo.participants.length}</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatLog.map((message) => (
            <ChatMessage
              key={message.id}
              message={message.content}
              sender={message.sender.nickname}
              isMine={message.sender.id === userId}
            />
          ))}
          <div ref={messageEndRef} />
        </div>

        <ChatInput onSendMessage={handleSendMessage} />
      </div>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="채팅방 제목 수정"
      >
        <EditChatTitle
          currentTitle={chatInfo.title}
          onSubmit={handleEditTitle}
          onCancel={() => setIsEditModalOpen(false)}
          isCreator={chatInfo.createdBy.id === userId}
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
      </Modal>
    </>
  );
}