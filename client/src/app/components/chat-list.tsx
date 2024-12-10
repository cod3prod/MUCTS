import ChatCard from "./chat-card";

export default function ChatList() {
  return (
    <section className="mt-8">
      <h2 className="text-2xl font-bold mb-4">최근 채팅방</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 임시 데이터로 6개의 카드 생성 */}
        {Array.from({ length: 6 }).map((_, index) => (
          <ChatCard key={index} />
        ))}
      </div>
    </section>
  );
} 