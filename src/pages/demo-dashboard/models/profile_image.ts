export interface ProfileImage {
    id: string;
    user_id: string;
    file_name: string;
    file_type: string;
    file_url: string;
    uploaded_at: Date;
    uploaded_by: string;
    is_active: boolean;
}