export interface MessageReaction {
    id: string;
    message_id: string;
    user_id: string;
    emoji: string;
    reacted_at: Date;
}