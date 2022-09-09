export interface IMessage {
    text: string;
    sender: string;
    created_at: string;
}

export interface IConversation {
    _id: string;
    members: string[];
    messages: IMessage[];
}