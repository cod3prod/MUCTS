import { IoArrowBack } from "react-icons/io5";
import { useChatStore } from "@/zustand/chat-store";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/zustand/auth-store";

export default function ExitButton() {
  const { user } = useAuthStore();
  const { socket, chatId } = useChatStore();
  const router = useRouter();

  const handleExit = () => {
    if (socket && chatId && user) {
      socket.emit("leaveChat", { userId: user.id, chatId });
    }
    router.push("/");
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
