export interface Plan {
    id: string;
    name: string;
    price: string;
    description: string;
    is_annual: boolean;
    discount: number;
    free_trial_days: number;
    max_admin: number;
    max_teacher: number;
    max_student: number;
    max_parent: number;
    createdAt: Date;
    updatedAt: Date;
}