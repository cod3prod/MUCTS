"use client";

import { FormEvent, useState } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";

interface CreateChatFormProps {
  onSubmit: (title: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export default function CreateChatForm({ 
  onSubmit, 
  onCancel, 
  isLoading = false,
  error 
}: CreateChatFormProps) {
  const [title, setTitle] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit(title);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg">
          {error}
        </div>
      )}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          채팅방 제목
        </label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={20}
          placeholder="채팅방 제목을 입력해주세요 (최대 20자)"
          required
          disabled={isLoading}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" onClick={onCancel} disabled={isLoading}>
          취소
        </Button>
        <Button type="submit" disabled={!title.trim() || isLoading}>
          {isLoading ? "생성 중..." : "생성하기"}
        </Button>
      </div>
    </form>
  );
} 