export interface Role {
    id: string;
    group_id: string;
    user_id: string;
    joined_at: Date;
    is_group_admin: boolean;
}