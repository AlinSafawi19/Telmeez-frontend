export interface StudentCard {
    id: string;
    user_id: string;
    card_number: string;
    issue_date: Date;
    expiration_date: Date;
    is_active: boolean;
    printed_by: string;
    created_at: Date;
    updated_at: Date;
}