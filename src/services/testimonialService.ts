const API_BASE_URL = 'http://localhost:5000/api';

export interface TestimonialForm {
  name: string;
  position: string;
  institution: string;
  quote: string;
  email: string;
}

export interface Testimonial {
  _id: string;
  name: string;
  position: string;
  institution: string;
  quote: string;
  email: string;
  initials: string;
  date: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  error?: string;
}

class TestimonialService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}/testimonials${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async submitTestimonial(testimonial: TestimonialForm): Promise<ApiResponse<Testimonial>> {
    return this.makeRequest<Testimonial>('/submit', {
      method: 'POST',
      body: JSON.stringify(testimonial),
    });
  }

  async getLatestTestimonials(): Promise<ApiResponse<Testimonial[]>> {
    return this.makeRequest<Testimonial[]>('/latest', {
      method: 'GET',
    });
  }

  async getAllTestimonials(): Promise<ApiResponse<Testimonial[]>> {
    return this.makeRequest<Testimonial[]>('/all', {
      method: 'GET',
    });
  }

  async updateTestimonialStatus(id: string, isApproved: boolean): Promise<ApiResponse<Testimonial>> {
    return this.makeRequest<Testimonial>(`/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ isApproved }),
    });
  }
}

export const testimonialService = new TestimonialService(); 