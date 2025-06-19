export interface PaymentMethod {
    id: string;
    card_number: string;
    expiry_month: number;
    expiry_year: number;
    cvv: string;
    subscriber_id: string;
    card_type_id: string;
    is_default: boolean;
    updated_at: Date;
    createdAt: Date;
}