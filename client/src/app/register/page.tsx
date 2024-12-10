import RegisterForm from "../components/auth/register-form";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <main className="mt-24 grow w-full max-w-7xl mx-auto p-4">
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-400px)]">
        <RegisterForm />
        <p className="mt-4 text-sm text-gray-500">
          이미 계정이 있으신가요?{" "}
          <Link href="/login" className="text-primary hover:text-primary-hover">
            로그인
          </Link>
        </p>
      </div>
    </main>
  );
} 