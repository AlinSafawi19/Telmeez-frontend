export interface PinnedMessage {
    id: string;
    message_id: string;
    pinned_by: string;
    pinned_at: Date;
    group_id: string;
}