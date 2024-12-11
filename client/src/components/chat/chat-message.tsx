interface ChatMessageProps {
  message: string;
  sender: string;
  isMine: boolean;
}

export default function ChatMessage({ message, sender, isMine }: ChatMessageProps) {
  return (
    <div className={`flex ${isMine ? 'flex-row-reverse' : 'flex-row'} gap-2`}>
      <div className="flex flex-col gap-1">
        {!isMine && (
          <span className="text-sm text-gray-500">{sender}</span>
        )}
        <div className={`max-w-[60%] rounded-2xl px-4 py-2 ${
          isMine 
            ? 'bg-primary text-white' 
            : 'bg-gray-100 text-gray-900'
        }`}>
          {message}
        </div>
      </div>
    </div>
  );
} 