export interface Notification {
    id: string;
    user_id: string;
    subscriber_id: string;
    title: string;
    content: string;
    is_read: boolean;
    created_at: Date;
    notification_type_id: string;
    redirect_url: string;
}