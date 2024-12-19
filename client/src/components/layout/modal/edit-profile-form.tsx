"use client";

import { FormEvent, useState } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";

interface EditProfileFormProps {
  currentNickname: string;
  currentEmail: string;
  onSubmit: (data: {
    nickname: string;
    email: string;
    password?: string;
  }) => void;
  onCancel: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export default function EditProfileForm({
  currentNickname,
  currentEmail,
  onSubmit,
  onCancel,
  isLoading = false,
  error,
}: EditProfileFormProps) {
  const [formData, setFormData] = useState({
    nickname: currentNickname,
    email: currentEmail,
    password: "",
  });
  const [validationError, setValidationError] = useState<{
    nickname?: string;
    email?: string;
    password?: string;
  }>({});

  const validateForm = () => {
    const errors: { nickname?: string; email?: string; password?: string } = {};

    if (formData.nickname.length < 2 || formData.nickname.length > 20) {
      errors.nickname = "닉네임은 2~20자 사이여야 합니다";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.email = "올바른 이메일 형식이 아닙니다";
    }

    if (formData.password && formData.password.length < 8) {
      errors.password = "비밀번호는 8자 이상이어야 합니다";
    }

    setValidationError(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (
      formData.nickname === currentNickname &&
      formData.email === currentEmail &&
      !formData.password
    )
      return;

    const submitData = {
      nickname: formData.nickname,
      email: formData.email,
      password: formData.password || undefined,
    };
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg">
          {error}
        </div>
      )}
      <div>
        <label
          htmlFor="nickname"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          닉네임
        </label>
        <Input
          id="nickname"
          type="text"
          value={formData.nickname}
          onChange={(e) =>
            setFormData({ ...formData, nickname: e.target.value })
          }
          maxLength={20}
          placeholder="닉네임을 입력해주세요"
          required
          disabled={isLoading}
        />
        {validationError.nickname && (
          <p className="mt-1 text-sm text-red-500">
            {validationError.nickname}
          </p>
        )}
      </div>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          이메일
        </label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="이메일을 입력해주세요"
          required
          disabled={isLoading}
        />
        {validationError.email && (
          <p className="mt-1 text-sm text-red-500">{validationError.email}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          새 비밀번호
        </label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          placeholder="변경할 비밀번호를 입력해주세요"
          disabled={isLoading}
        />
        {validationError.password && (
          <p className="mt-1 text-sm text-red-500">
            {validationError.password}
          </p>
        )}
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" onClick={onCancel} disabled={isLoading}>
          취소
        </Button>
        <Button
          type="submit"
          disabled={
            isLoading ||
            (formData.nickname === currentNickname &&
              formData.email === currentEmail &&
              !formData.password)
          }
        >
          {isLoading ? "수정 중..." : "수정하기"}
        </Button>
      </div>
    </form>
  );
}
