import api from './api';

// Contact & Support interfaces matching backend API documentation
export interface ContactMessage {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  category: 'general' | 'order' | 'payment' | 'product' | 'technical' | 'complaint';
}

export interface ContactResponse {
  success: boolean;
  message: string;
  reference: string;
}

export interface NewsletterSubscribeRequest {
  email: string;
  firstName?: string;
}

export interface NewsletterResponse {
  success: boolean;
  message: string;
}

export interface NewsletterUnsubscribeRequest {
  email: string;
}

export interface CallbackRequest {
  name: string;
  phone: string;
  email?: string;
  preferredTime?: string;
  message?: string;
}

export interface CallbackCheckResponse {
  exists: boolean;
  reference?: string;
  createdAt?: string;
}

// Contact service functions
export const contactService = {
  // Send contact form message
  async sendContactMessage(messageData: ContactMessage): Promise<ContactResponse> {
    const response = await api.post('/contact/send', messageData);
    return response.data;
  },

  // Create callback request
  async createCallback(data: CallbackRequest): Promise<{ success: boolean; reference?: string; message?: string }> {
    const response = await api.post('/contact/callback', data);
    return response.data;
  },

  // Check recent callback
  async checkCallback(params: { phone?: string; email?: string }): Promise<CallbackCheckResponse> {
    const response = await api.get('/contact/callback/check', { params });
    return response.data;
  },

  // Subscribe to newsletter
  async subscribeNewsletter(subscriptionData: NewsletterSubscribeRequest): Promise<NewsletterResponse> {
    const response = await api.post('/contact/newsletter/subscribe', subscriptionData);
    return response.data;
  },

  // Unsubscribe from newsletter
  async unsubscribeNewsletter(unsubscribeData: NewsletterUnsubscribeRequest): Promise<NewsletterResponse> {
    const response = await api.post('/contact/newsletter/unsubscribe', unsubscribeData);
    return response.data;
  },

  // Helper function to validate email format
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Helper function to validate contact form data
  validateContactForm(data: ContactMessage): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!data.name || data.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }

    if (!data.email || !this.validateEmail(data.email)) {
      errors.push('Please enter a valid email address');
    }

    if (!data.subject || data.subject.trim().length < 3) {
      errors.push('Subject must be at least 3 characters long');
    }

    if (!data.message || data.message.trim().length < 10) {
      errors.push('Message must be at least 10 characters long');
    }

    const validCategories = ['general', 'order', 'payment', 'product', 'technical', 'complaint'];
    if (!validCategories.includes(data.category)) {
      errors.push('Please select a valid category');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
};

// Export individual functions for backward compatibility
export const sendContactMessage = contactService.sendContactMessage;
export const subscribeNewsletter = contactService.subscribeNewsletter;
export const unsubscribeNewsletter = contactService.unsubscribeNewsletter;
export const validateEmail = contactService.validateEmail;
export const validateContactForm = contactService.validateContactForm;
