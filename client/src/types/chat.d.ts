type ChatRoomProps = {
  chatId: number;
  userId: number;
  token: string;
};

// 소켓 이벤트 타입
type SocketEvent = 
  | "joinChat" 
  | "leaveChat"
  | "sendMessage"
  | "patchChat"
  | "deleteChat"
  | "userJoined"
  | "userLeft"
  | "newMessage"
  | "chatUpdated"
  | "chatDeleted"
  | "error";

// 소켓 요청 타입
type JoinChatRequest = {
  userId: number;
  chatId: number;
};

type LeaveChatRequest = {
  userId: number;
  chatId: number;
};

type SendMessageRequest = {
  senderId: number;
  chatId: number;
  content: string;
};

type PatchChatRequest = {
  id: number;
  patchChatDto: {
    title?: string;
  };
};

type DeleteChatRequest = {
  id: number;
  createdById: number;
};

// 소켓 응답 타입
type ErrorResponse = {
  message: string;
  event: SocketEvent;
};

type MessageResponse = {
  id: number;
  content: string;
  createdAt: string;
  sender: {
    id: number;
    username: string;
    nickname: string;
  };
  chatId: number;
};

type ChatResponse = {
  id: number;
  title: string;
  createdAt: string;
  createdBy: {
    id: number;
    username: string;
    nickname: string;
  };
  participants: {
    id: number;
    username: string;
    nickname: string;
  }[];
};

type DeleteChatResponse = {
  chatId: number;
  createdBy: {
    id: number;
  };
};

export type {
  ChatRoomProps,
  SocketEvent,
  JoinChatRequest,
  LeaveChatRequest,
  SendMessageRequest,
  PatchChatRequest,
  DeleteChatRequest,
  ErrorResponse,
  MessageResponse,
  ChatResponse,
  DeleteChatResponse,
};
