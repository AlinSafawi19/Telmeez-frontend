export interface Course {
    id: string;
    name: string;
    description: string;
    department_id: string;
    created_at: Date;
    updated_at: Date;
    created_by: string;
    updated_by: string;
    is_active: boolean;
    is_deleted: boolean;
    is_archived: boolean;
}