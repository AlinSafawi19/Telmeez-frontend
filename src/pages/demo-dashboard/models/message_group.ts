export interface Role {
    id: string;
    name: string;
    created_by: string;
    created_at: Date;
    is_admins_only: boolean;
}