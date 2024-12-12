"use client";

import { FormEvent, useState } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";

interface CreateChatFormProps {
  onSubmit: (title: string) => void;
  onCancel: () => void;
}

export default function CreateChatForm({ onSubmit, onCancel }: CreateChatFormProps) {
  const [title, setTitle] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit(title);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button"  onClick={onCancel}>
          취소
        </Button>
        <Button type="submit" disabled={!title.trim()}>
          생성하기
        </Button>
      </div>
    </form>
  );
} 