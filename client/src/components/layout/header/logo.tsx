import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center justify-center">
      <h1 className="text-2xl lg:text-3xl font-black tracking-tight bg-gradient-to-r from-primary via-primary-focus to-yellow-400 text-transparent bg-clip-text">
        MUCTS
      </h1>
    </Link>
  );
}

