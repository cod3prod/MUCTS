"use client";

import { FormEvent, useState } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import useFetch from "@/hooks/use-fetch";
import { useRouter } from "next/navigation";

interface ValidationErrors {
  username?: string;
  email?: string;
  nickname?: string;
  password?: string;
}

export default function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    nickname: "",
    password: "",
  });
  const [errors, setErrors] = useState<ValidationErrors>({});

  const { fetchData, error, loading } = useFetch<{ accessToken: string; refreshToken: string }>({
    url: `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
    method: "POST",
    body: formData,
  });

  const validateForm = () => {
    const newErrors: ValidationErrors = {};

    // 아이디 검증
    if (formData.username.length < 4 || formData.username.length > 20) {
      newErrors.username = "아이디는 4~20자 사이여야 합니다";
    }

    // 이메일 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "올바른 이메일 형식이 아닙니다";
    }

    // 닉네임 검증
    if (formData.nickname.length < 2 || formData.nickname.length > 20) {
      newErrors.nickname = "닉네임은 2~20자 사이여야 합니다";
    }

    // 비밀번호 검증
    if (formData.password.length < 8) {
      newErrors.password = "비밀번호는 8자 이상이어야 합니다";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    await fetchData();
    
    if (!error) {
      router.push("/login");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-primary via-primary-focus to-yellow-400 text-transparent bg-clip-text">
        MUCTS 회원가입
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg">
            {error}
          </div>
        )}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            아이디
          </label>
          <Input
            id="username"
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
            placeholder="아이디를 입력해주세요"
            disabled={loading}
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-500">{errors.username}</p>
          )}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            이메일
          </label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            placeholder="이메일을 입력해주세요"
            disabled={loading}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
          )}
        </div>
        <div>
          <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-1">
            닉네임
          </label>
          <Input
            id="nickname"
            type="text"
            value={formData.nickname}
            onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
            required
            placeholder="닉네임을 입력해주세요"
            disabled={loading}
          />
          {errors.nickname && (
            <p className="mt-1 text-sm text-red-500">{errors.nickname}</p>
          )}
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            비밀번호
          </label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            placeholder="비밀번호를 입력해주세요"
            disabled={loading}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">{errors.password}</p>
          )}
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "처리중..." : "회원가입"}
        </Button>
      </form>
    </div>
  );
}