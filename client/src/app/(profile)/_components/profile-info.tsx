import { UsersControllerResponse } from "@/types/api";
import ProfileEditButton from "./profile-edit-button";
import DeleteUserButton from "./delete-user-button";

export default function ProfileHeader({
  data,
}: {
  data: UsersControllerResponse | null;
}) {
  const user = data?.user;
  {
    new Date(user?.createdAt || new Date().toISOString()).toLocaleDateString();
  }

  return (
    <div className="pt-20 pb-8 px-8">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-bold">{user?.nickname || "닉네임"}</h1>
        <p className="text-gray-500">@{user?.username || "아이디"}</p>
        <p className="text-gray-500">{user?.email || "users@email.com"}</p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-6">
        <div>
          <p className="text-sm text-gray-500">가입일</p>
          <p className="mt-1.5 font-medium">
            {new Date(
              user?.createdAt || new Date().toISOString()
            ).toLocaleDateString()}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">수정일</p>
          <p className="mt-1.5 font-medium">
            {new Date(
              user?.updatedAt || new Date().toISOString()
            ).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <ProfileEditButton
          nickname={user?.nickname || ""}
          email={user?.email || ""}
        />
        <DeleteUserButton />
      </div>
    </div>
  );
}
