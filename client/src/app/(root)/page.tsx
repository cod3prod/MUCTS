import Banner from "./_components/banner";
import ChatList from "./_components/chat-list";

export default function Page() {
  return (
    <main className="mt-24 grow w-full max-w-7xl mx-auto p-4">
      <Banner />
      <ChatList />
    </main>
  )
}