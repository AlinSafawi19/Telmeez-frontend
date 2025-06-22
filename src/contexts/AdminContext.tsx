export interface Admin {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    date: string;
    stats: {
        totalUsers: number;
        activeUsers: number;
        revenue: number;
    };
    status: 'active' | 'inactive';
}