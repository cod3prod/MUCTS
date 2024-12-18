// Entity
type User = {
    id?: number;
    username?: string;
    nickname?: string;
    email?: string;
    chatId?: number | null;
    createdAt?: string;
    updatedAt?: string | null;
}

type Message = {
    content: string;
    createdAt: string;
    sender: User;
}

type Chat = {
    id: number;
    title?: string;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string | null;
    createdBy?: User;
    participants?: User[];
    messages?: Message[];
}

export { User, Message, Chat };