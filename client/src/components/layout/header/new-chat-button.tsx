"use client";

import Button from "@/components/ui/button";
import { useState } from "react";
import Modal from "../modal";
import CreateChatForm from "../modal/create-chat-form";
import { useAuthStore } from "@/zustand/auth-store";
import { useFetch } from "@/hooks/use-fetch";
import { ChatsControllerResponse, UsersControllerResponse } from "@/types/api";
import { useRouter } from "next/navigation";

export default function NewChatButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const { isLoading, fetchWithRetry } =
    useFetch<ChatsControllerResponse|UsersControllerResponse>();
  const { accessToken, isAuthenticated, user } = useAuthStore();
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const URL = `${BASE_URL}/chats`;

const handleCreateChat = async (title: string) => {
  if (!isAuthenticated || !user) {
    setShowAlert(true);
    return;
  }

  try {
    const userResponse: UsersControllerResponse | null = await fetchWithRetry(
      `${BASE_URL}/users/me`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (userResponse?.user?.chatId) {
      setError("이미 다른 채팅방에 참여 중입니다");
      setIsModalOpen(true);
      return;
    }

    const result:ChatsControllerResponse | null = await fetchWithRetry(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ title: title, createdById: user.id }),
    });

    if (error) {
      setIsModalOpen(true);
      return;
    }
    
    if(result) {
      setIsModalOpen(false);
      router.push(`/chat/${result.chat!.id}`);
    }
  } catch (err) {
    setError("채팅방 생성 중 오류가 발생했습니다");
    setIsModalOpen(true);
  }
};

  return (
    <>
      <button
        disabled={isLoading}
        onClick={() => setIsModalOpen(true)}
        className="flex items-center justify-center flex-1 h-10 lg:h-full text-sm lg:text-xl text-gray-500 hover:text-black font-medium border-b-2 border-transparent hover:border-primary"
      >
        {isLoading ? "기다려주세요" : "새 채팅"}
      </button>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="새로운 채팅방 만들기"
      >
        <CreateChatForm
          onSubmit={handleCreateChat}
          onCancel={() => setIsModalOpen(false)}
          isLoading={isLoading}
          error={error}
        />
      </Modal>

      <Modal
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        title="알림"
      >
        <div className="p-4 text-center">
          <p>로그인이 필요합니다.</p>
          <Button
            onClick={() => setShowAlert(false)}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80"
          >
            확인
          </Button>
        </div>
      </Modal>
    </>
  );
}
