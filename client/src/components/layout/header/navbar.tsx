import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex w-full border-t border-gray-100 lg:border-none lg:w-[600px]">
      <Link 
        href="/" 
        className="flex items-center justify-center flex-1 h-10 lg:h-full text-sm lg:text-xl text-gray-500 hover:text-black font-medium border-b-2 border-transparent hover:border-primary"
      >
        프로필
      </Link>
      <Link 
        href="/" 
        className="flex items-center justify-center flex-1 h-10 lg:h-full text-sm lg:text-xl text-gray-500 hover:text-black font-medium border-b-2 border-transparent hover:border-primary"
      >
        내 채팅
      </Link>
      <Link 
        href="/" 
        className="flex items-center justify-center flex-1 h-10 lg:h-full text-sm lg:text-xl text-gray-500 hover:text-black font-medium border-b-2 border-transparent hover:border-primary"
      >
        새 채팅
      </Link>
    </nav>
  );
}
