import { IoArrowBack } from "react-icons/io5";
import { useChatStore } from "@/zustand/chat-store";
import { useAuthStore } from "@/zustand/auth-store";
import { useRouter } from "next/navigation";

export default function ExitButton() {
  const { user } = useAuthStore();
  const { socket, chatId, createdBy } = useChatStore();
  const router = useRouter();

  const handleExit = () => {
    if (socket && chatId && user && createdBy) {
      if (createdBy.id === user.id) {
        return socket.emit("deleteChat", { id: chatId, createdById: user.id });
      }
      socket.emit("leaveChat", { userId: user.id, chatId });
      return router.push("/");
    }
  };

  return (
    <button
      onClick={handleExit}
      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
      aria-label="나가기"
    >
      <IoArrowBack className="w-5 h-5 text-gray-500" />
    </button>
  );
}
