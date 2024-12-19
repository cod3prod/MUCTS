"use client";

import ChatCard from "./chat-card";
import { ChatsControllerResponse } from "@/types/api";
import { useFetch } from "@/hooks/use-fetch";
import { useEffect, useState } from "react";

export default function ChatList() {
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const URL = `${BASE_URL}/chats`;
  const { fetchWithRetry, isLoading, error } = useFetch<ChatsControllerResponse>();
  const [data, setData] = useState<ChatsControllerResponse | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchWithRetry(URL);
      setData(result);
    }

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <section className="mt-8">
        <h2 className="text-2xl font-bold mb-4">최근 채팅방</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="h-32 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mt-8">
        <h2 className="text-2xl font-bold mb-4">최근 채팅방</h2>
        <p className="text-red-500">{error}</p>
      </section>
    );
  }

  return (
    <section className="mt-8">
      <h2 className="text-2xl font-bold mb-4">최근 채팅방</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.chats?.length === 0 && <p>채팅방이 없습니다.</p>}
        {data?.chats?.map((chat) => (
          <ChatCard
            key={chat.id}
            id={chat.id}
            title={chat.title!}
            createdAt={chat.createdAt!}
            createdBy={chat.createdBy!.nickname!}
            participantsCount={chat.participants!.length}
          />
        ))}
      </div>
    </section>
  );
}
