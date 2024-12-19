"use client";

import Link from "next/link";
import MyChatButton from "./my-chat-button";
import NewChatButton from "./new-chat-button";

export default function Navbar() {
  return (
    <nav className="flex w-full border-t border-gray-100 lg:border-none lg:w-[600px]">
      <Link
        href="/profile"
        className="flex items-center justify-center flex-1 h-10 lg:h-full text-sm lg:text-xl text-gray-500 hover:text-black font-medium border-b-2 border-transparent hover:border-primary"
      >
        프로필
      </Link>
      <MyChatButton />
      <NewChatButton />
    </nav>
  );
}
