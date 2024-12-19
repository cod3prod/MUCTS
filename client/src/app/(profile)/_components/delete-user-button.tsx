"use client";

import Modal from "@/components/layout/modal";
import { useState } from "react";
import { useAuthStore } from "@/zustand/auth-store";
import { useFetch } from "@/hooks/use-fetch";
import { useRouter } from "next/navigation";
import { UsersControllerResponse } from "@/types/api";

export default function DeleteUserButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { accessToken, logout, user } = useAuthStore();
  const router = useRouter();
  const { fetchWithRetry } = useFetch<UsersControllerResponse>();
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleDeleteUser = async () => {
    if(!user){
        return;
    }
    await fetchWithRetry(`${BASE_URL}/users/${user.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    logout();
    router.push("/");
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex-1 py-2.5 text-sm font-medium text-red-500 hover:text-white border border-red-500 hover:bg-red-500 rounded-lg transition-colors"
      >
        회원 탈퇴
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="회원 탈퇴"
      >
        <div className="p-4 text-center">
          <h3 className="text-lg font-bold mb-2">정말 탈퇴하시겠습니까?</h3>
          <p className="text-gray-600 mb-6">
            탈퇴하시면 모든 데이터가 삭제되며 복구할 수 없습니다.
          </p>
          <div className="flex justify-center gap-2">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleDeleteUser}
              className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
            >
              탈퇴하기
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
