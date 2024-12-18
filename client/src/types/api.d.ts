import { Chat, User } from "./entity";

// API Response
type RefreshTokenResponse = {
  accessToken: string;
  refreshToken: string;
};

type LogInResponse = {
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
  user: {
    id: number;
    username: string;
    nickname: string;
  };
};

type UsersControllerResponse = {
  status: "ok";
  user?: User;
  message?: string; // API Message
};

type ChatsControllerResponse = {
  status: "ok";
  chat?: Chat;
  chats?: Chat[];
};

export {
  RefreshTokenResponse,
  LogInResponse,
  UsersControllerResponse,
  ChatsControllerResponse,
};
