export interface Subscriber {
    id: string;
    institution_name: string;
    last_payment_id: string;
    recurrence: string;
    is_active: boolean;
    is_auto_renew: boolean;
    createdAt: Date;
    updatedAt: Date;
}