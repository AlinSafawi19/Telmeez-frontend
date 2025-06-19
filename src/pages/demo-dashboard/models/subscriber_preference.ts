export interface SubscriberPreference {
    id: string;
    language: string;
    is_auto_renewed: boolean;
    subscriber_id: string;
    timezone: string
    updated_at: Date;
    createdAt: Date;
}