export interface Subscriber {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    password: string;
    institution_name: string;
    primary_address: string;
    secondary_address: string;
    profile_image_id: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    subscriber_preference_id: string;
    institution_type_id: string;
    updated_at: Date;
    createdAt: Date;
}