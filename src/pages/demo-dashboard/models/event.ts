export interface Event {
    id: string;
    title: string;
    description: string;
    start_date: Date;
    end_date: Date;
    location: string;
    created_at: Date;
    updated_at: Date;
    created_by: string;
    subscriber_id: string;
    department_id: string;
    course_id: string;
    event_type: string;
    is_public: boolean;
}