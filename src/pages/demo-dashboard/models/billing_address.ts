export interface BillingAddress {
    id: string;
    primary_address: string;
    secondary_address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    subscriber_id: string;
    createdAt: Date;
    updatedAt: Date;
}