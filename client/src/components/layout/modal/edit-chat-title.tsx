"use client";

import { FormEvent, useState } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";

interface EditChatTitleProps {
  currentTitle: string;
  onSubmit: (title: string) => void;
  onCancel: () => void;
  isCreator: boolean;
}

export default function EditChatTitle({
  currentTitle,
  onSubmit,
  onCancel,
  isCreator,
}: EditChatTitleProps) {
  const [title, setTitle] = useState(currentTitle);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || title === currentTitle || !isCreator) return;
    onSubmit(title);
  };

  if (!isCreator) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-500">채팅방 제목은 방장만 수정할 수 있습니다.</p>
        <Button onClick={onCancel} className="mt-4">
          확인
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          새로운 채팅방 제목
        </label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={20}
          placeholder="새로운 제목을 입력해주세요 (최대 20자)"
          required
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" onClick={onCancel}>
          취소
        </Button>
        <Button
          type="submit"
          disabled={!title.trim() || title === currentTitle}
        >
          수정하기
        </Button>
      </div>
    </form>
  );
}
