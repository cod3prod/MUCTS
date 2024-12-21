import Link from "next/link";
import Button from "./button";

export default function RequireLogin() {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black bg-opacity-10">
      <div className="bg-white shadow-lg rounded-lg p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          로그인이 필요합니다
        </h1>
        <p className="text-gray-600 mb-6">
          이 기능을 사용하려면 로그인을 완료해 주세요.
        </p>
        <Button>
          <Link href="/login">로그인 하러 가기</Link>
        </Button>
      </div>
    </div>
  );
}
