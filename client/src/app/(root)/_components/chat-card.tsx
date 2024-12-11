import Link from "next/link";
import { FaRegUser } from "react-icons/fa6";

interface ChatCardProps {
  title: string;
  createdAt: string;
  createdBy: string;
  participantsCount: number;
}

export default function ChatCard() {
  return (
    <Link 
      href="/chat/1" 
      className="block w-full p-4 border border-gray-200 rounded-lg hover:border-primary transition-colors"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold truncate">
            타밥 탈출! 마포구 저녁 식사 모임
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            김하나
          </p>
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <FaRegUser className="w-4 h-4" />
          <span>4</span>
        </div>
      </div>
      <div className="mt-2 text-sm text-gray-500">
        2024년 3월 20일
      </div>
    </Link>
  );
} 