export interface Announcement {
    id: string;
    title: string;
    content: string;
    created_at: Date;
    updated_at: Date;
    posted_by: string;
    subscriber_id: string;
    department_id: string;
    course_id: string;
    start_date: Date;
    end_date: Date;
    is_active: boolean;
}