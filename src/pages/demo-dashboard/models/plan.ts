export interface Plan {
    id: string;
    name: string;
    pricepermonth: string;
    description: string;
    discountperyear: number;
    max_admin: number | null;
    max_teacher: number | null;
    max_student: number | null;
    max_parent: number | null;
    createdAt: Date;
    updatedAt: Date;
}