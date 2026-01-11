export interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  gradient: 'tech-primary' | 'tech-secondary';
  category: 'production' | 'development';
  formRoute: string;
  customFields?: ServiceCustomField[];
}

export interface ServiceCustomField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'number';
  required: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  validation?: (value: string) => string | undefined;
}

export interface FormData {
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  budget: string;
  timeline: string;
  message: string;
  [key: string]: string; // For custom fields
}

export interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  serviceType?: string;
  budget?: string;
  timeline?: string;
  message?: string;
  [key: string]: string | undefined; // For custom field errors
}

export interface RequestSubmission {
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  budget: string;
  timeline: string;
  message: string;
  createdAt: any; // Firestore Timestamp
  status: 'new' | 'contacted' | 'completed';
  [key: string]: any; // For custom fields and other data
}
