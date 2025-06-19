export interface Role {
    id: string;
    sender_id: string;
    receiver_id: string;
    group_id: string;
    content: string;
    is_read: boolean;
    sent_at: Date;
    edited_at: Date;
    deleted_at: Date;
    reply_to_id: string;
}