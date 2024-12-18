import Link from "next/link";
import { FaRegUser } from "react-icons/fa6";

interface ChatCardProps {
  id: number;
  title: string;
  createdAt: string;
  createdBy: string;
  participantsCount: number;
}

export default function ChatCard({ id, title, createdAt, createdBy, participantsCount }: ChatCardProps) {
  const date = new Date(createdAt);
  const formattedDate = `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;

  return (
    <Link 
      href={`/chat/${id}`}
      className="block w-full p-4 border border-gray-200 rounded-lg hover:border-primary transition-colors"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold truncate">
            {title}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {createdBy}
          </p>
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <FaRegUser className="w-4 h-4" />
          <span>{participantsCount}</span>
        </div>
      </div>
      <div className="mt-2 text-sm text-gray-500">
        {formattedDate}
      </div>
    </Link>
  );
}