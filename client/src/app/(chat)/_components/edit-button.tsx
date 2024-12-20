import Modal from "@/components/layout/modal";
import EditChatTitle from "@/components/layout/modal/edit-chat-title";
import { FaEdit } from "react-icons/fa";
import { useChatStore } from "@/zustand/chat-store";
import { useState } from "react";
import { useAuthStore } from "@/zustand/auth-store";

export default function EditButton() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { title, createdBy, socket, chatId } = useChatStore();
  const { user } = useAuthStore();

  if (title === null) return null;

  const handleEditTitle = (title: string) => {
    if (socket && createdBy && chatId)
      socket.emit("patchChat", { id: chatId, createdById: createdBy.id, patchChatDto: { title } });
    setIsEditModalOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsEditModalOpen(true)}
        className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors duration-500"
        aria-label="채팅방 제목 수정"
      >
        <FaEdit className="w-5 h-5 text-gray-500" />
      </button>
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="채팅방 제목 수정"
      >
        <EditChatTitle
          currentTitle={title}
          onSubmit={handleEditTitle}
          onCancel={() => setIsEditModalOpen(false)}
          isCreator={createdBy?.id === user?.id}
        />
      </Modal>
    </>
  );
}
