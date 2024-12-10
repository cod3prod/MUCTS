import Banner from "./components/banner";
import ChatList from "./components/chat-list";

export default function Page() {
  return (
    <main className="mt-24 grow w-full max-w-7xl mx-auto p-4">
      <Banner />
      <ChatList />
    </main>
  )
}