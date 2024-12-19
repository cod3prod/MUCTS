export default function ProfileHeader() {
  return (
    <div className="relative h-40 bg-gradient-to-r from-primary via-primary-focus to-yellow-400">
      <div className="absolute -bottom-16 left-8">
        <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center">
          <span className="text-4xl text-gray-400">🍽️</span>
        </div>
      </div>
    </div>
  );
}
