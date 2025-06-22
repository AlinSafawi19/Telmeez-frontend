export interface Payment {
    id: string;
    payment_method_id: string;
    plan_id: string;
    final_price: string;
    next_payment_date: Date;
    payment_status_id: string;
    promo_code_id: string;
    subscriber_id: string;
    billing_address_id: string;
    is_annual: boolean;
    createdAt: Date;
}