export interface Department {
    id: string;
    name: string;
    description: string;
    created_at: Date;
    updated_at: Date;
    created_by: string;
    updated_by: string;
    is_active: boolean;
    is_deleted: boolean;
    is_archived: boolean;
    head_of_department_id: string;
}