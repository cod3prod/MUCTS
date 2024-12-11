import LoginForm from "../_components/login-form";
import Link from "next/link";

export default function Page() {
  return (
    <main className="mt-24 grow w-full max-w-7xl mx-auto p-4">
      <section className="flex flex-col items-center justify-center min-h-[calc(100vh-400px)]">
        <LoginForm />
        <p className="mt-4 text-sm text-gray-500">
          아직 계정이 없으신가요?{" "}
          <Link
            href="/register"
            className="text-primary hover:text-primary-hover"
          >
            회원가입
          </Link>
        </p>
      </section>
    </main>
  );
}
