"use client";

import { FaRegUser } from "react-icons/fa6";
import { IoArrowBack } from "react-icons/io5";
import ChatMessage from "./chat-message";
import ChatInput from "./chat-input";
import { useRouter } from "next/navigation";

export default function ChatRoom() {
  const router = useRouter();

  const handleExit = () => {
    router.push('/');
  };

  return (
    <div className="h-[calc(100vh-200px)] max-w-4xl mx-auto flex flex-col bg-white rounded-xl shadow-lg">
      {/* 채팅방 헤더 */}
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
            <h1 className="text-xl font-bold">혼밥 탈출! 마포구 저녁 식사 모임</h1>
            <p className="mt-1 text-sm text-gray-500">오늘 저녁 7시 @ 연남동</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-gray-500">
          <FaRegUser className="w-5 h-5" />
          <span>4</span>
        </div>
      </div>

      {/* 채팅 메시지 영역 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <ChatMessage 
          message="안녕하세요! 오늘 저녁 7시에 연남동에서 만나요~안녕하세요! 오늘 저녁 7시에 연남동에서 만나요~안녕하세요! 오늘 저녁 7시에 연남동에서 만나요~안녕하세요! 오늘 저녁 7시에 연남동에서 만나요~안녕하세요! 오늘 저녁 7시에 연남동에서 만나요~안녕하세요! 오늘 저녁 7시에 연남동에서 만나요~안녕하세요! 오늘 저녁 7시에 연남동에서 만나요~" 
          sender="김하나"
          isMine={false}
        />
        <ChatMessage 
          message="네! 반갑습니다 :)네! 반갑습니다 :)네! 반갑습니다 :)네! 반갑습니다 :)네! 반갑습니다 :)네! 반갑습니다 :)네! 반갑습니다 :)네! 반갑습니다 :)네! 반갑습니다 :)네! 반갑습니다 :)" 
          sender="나"
          isMine={true}
        />
        <ChatMessage 
          message="저도 참석합니다!" 
          sender="이둘"
          isMine={false}
        />
      </div>

      {/* 채팅 입력 영역 */}
      <ChatInput />
    </div>
  );
} 