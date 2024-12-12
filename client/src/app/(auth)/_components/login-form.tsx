"use client";

import { FormEvent, useState } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import useFetch from "@/hooks/use-fetch";
import { LoginResponse } from "@/types/auth";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/zustand/auth-store";

interface ValidationErrors {
  username?: string;
  password?: string;
}

export default function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  
  const { fetchData, error, loading } = useFetch<LoginResponse>({
    url: `${process.env.NEXT_PUBLIC_API_URL}/auth/log-in`,
    method: "POST",
    body: formData,
  });

  const { login } = useAuthStore();

  const validateForm = () => {
    const newErrors: ValidationErrors = {};

    if (formData.username.length < 4 || formData.username.length > 20) {
      newErrors.username = "아이디는 4~20자 사이여야 합니다";
    }

    if (formData.password.length < 8) {
      newErrors.password = "비밀번호는 8자 이상이어야 합니다";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const response = await fetchData();
    console.log('테스트', response);
    
    if (response) {
      await login(response);
      router.push("/");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-primary via-primary-focus to-yellow-400 text-transparent bg-clip-text">
        MUCTS 로그인
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
          {loading ? "로그인 중..." : "로그인"}
        </Button>
      </form>
    </div>
  );
} 