import Button from "@/components/ui/button";
import Logo from "./logo";
import Navbar from "./navbar";

export default function PCMenu() {
  return (
    <div className="hidden lg:flex w-full h-24 items-center justify-between px-4">
      <Logo />
      <div className="h-full flex justify-center">
        <Navbar />
      </div>
      <Button className="flex items-center justify-center rounded-full w-24">
        <span>로그인</span>
      </Button>
    </div>
  )
}