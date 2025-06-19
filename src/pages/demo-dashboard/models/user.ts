export interface User {
    id: string
    first_name: string
    last_name: string
    email: string
    phone: string
    profile_image_id: string;
    password: string;
    subscriber_id: string
    user_status_id: string
    role_id: string
    department_id: string
    course_id: string
    user_preference_id: string
    is_online: boolean
    is_verified: boolean
    last_login: Date;
    primary_address: string;
    secondary_address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;
}