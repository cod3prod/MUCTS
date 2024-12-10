import Button from "@/components/ui/button";
import Logo from "./logo";
import Navbar from "./navbar";

export default function MobileMenu() {
  return (
    <div className="lg:hidden h-full flex flex-col">
      <div className="flex items-center justify-between px-4 h-14">
        <Button className="flex items-center justify-center rounded-full py-0 h-6">
          <span className="text-xs">로그인</span>
        </Button>
        <Logo />
        <div className="w-[58px]" />
      </div>
      <div className="flex-1 flex items-end">
        <Navbar />
      </div>
    </div>
  );
}
