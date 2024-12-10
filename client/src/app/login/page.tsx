import LoginForm from "../components/auth/login-form";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="mt-24 grow w-full max-w-7xl mx-auto p-4">
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-400px)]">
        <LoginForm />
        <p className="mt-4 text-sm text-gray-500">
          아직 계정이 없으신가요?{" "}
          <Link href="/register" className="text-primary hover:text-primary-hover">
            회원가입
          </Link>
        </p>
      </div>
    </main>
  );
} 