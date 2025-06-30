const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface UserStats {
  maxAdmins: number | 'unlimited';
  maxTeachers: number | 'unlimited';
  maxParents: number | 'unlimited';
  maxStudents: number | 'unlimited';
  usedAdmins: number;
  usedTeachers: number;
  usedParents: number;
  usedStudents: number;
}

export interface StatsResponse {
  success: boolean;
  message: string;
  data: {
    stats: UserStats;
  };
}

class StatsService {
  // Get user statistics
  async getUserStats(): Promise<UserStats> {
    try {
      const response = await fetch(`${API_BASE_URL}/stats/user`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies
      });

      const data: StatsResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to get user statistics');
      }

      return data.data.stats;
    } catch (error) {
      console.error('Get user stats error:', error);
      throw error;
    }
  }

  // Get system statistics (admin only)
  async getSystemStats(): Promise<UserStats> {
    try {
      const response = await fetch(`${API_BASE_URL}/stats/system`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies
      });

      const data: StatsResponse = await response.json();

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Access denied. Admin privileges required.');
        }
        throw new Error(data.message || 'Failed to get system statistics');
      }

      return data.data.stats;
    } catch (error) {
      console.error('Get system stats error:', error);
      throw error;
    }
  }
}

export default new StatsService(); 