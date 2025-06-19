export interface PromoCode {
    id: string;
    name: string;
    price: string;
    description: string;
    is_active: boolean;
    discount: number;
    start_date: Date;
    end_date: Date;
    usage_limits: number;
    applies_to: string;
}