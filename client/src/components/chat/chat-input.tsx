import { FormEvent, useState } from "react";
import Button from "@/components/ui/button";
import { IoSend } from "react-icons/io5";

export default function ChatInput() {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    // TODO: 메시지 전송 로직 구현
    console.log(message);
    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t">
      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="메시지를 입력하세요..."
          className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <Button 
          type="submit" 
          className="rounded-full w-10 h-10 p-0 flex items-center justify-center"
        >
          <IoSend className="w-5 h-5" />
        </Button>
      </div>
    </form>
  );
} 