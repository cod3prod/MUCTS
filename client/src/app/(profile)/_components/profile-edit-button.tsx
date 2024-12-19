import Modal from "@/components/layout/modal";
import EditProfileForm from "@/components/layout/modal/edit-profile-form";
import Button from "@/components/ui/button";
import { useFetch } from "@/hooks/use-fetch";
import { UsersControllerResponse } from "@/types/api";
import { useState } from "react";
import { useAuthStore } from "@/zustand/auth-store";
import { useRouter } from "next/navigation";

export default function ProfileEditButton({
  email,
  nickname,
}: {
  email: string;
  nickname: string;
}) {
  const { accessToken } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isLoading, fetchWithRetry, error } =
    useFetch<UsersControllerResponse | null>();
  const { user, setUser } = useAuthStore();
  const handleEditChat = async (formData: {
    nickname?: string;
    email?: string;
    password?: string;
  }) => {
    if (!user) return null;
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    const URL = `${BASE_URL}/users/${user.id}`;

    setIsModalOpen(true);
    const result: UsersControllerResponse | null = await fetchWithRetry(URL, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(formData),
    });
    if (result?.user?.username) {
      setUser({
        ...user,
        username: result.user.username,
      })
      setIsModalOpen(false)
    };
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex-1 py-2.5 text-sm font-medium text-white bg-primary hover:bg-primary-hover rounded-lg transition-colors"
      >
        프로필 수정
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="새로운 채팅방 만들기"
      >
        <EditProfileForm
          currentEmail={email}
          currentNickname={nickname}
          onSubmit={handleEditChat}
          onCancel={() => setIsModalOpen(false)}
          isLoading={isLoading}
          error={error}
        />
      </Modal>
    </>
  );
}
