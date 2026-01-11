import { FormData, FormErrors } from '../types';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  // Remove all non-digit characters for validation
  const digitsOnly = phone.replace(/\D/g, '');
  // Accept formats: 10 digits (US), 11 digits (with country code), or international
  return digitsOnly.length >= 10 && digitsOnly.length <= 15;
};

export const formatPhone = (phone: string): string => {
  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');
  
  // Format as (XXX) XXX-XXXX for US numbers
  if (digitsOnly.length === 10) {
    return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
  }
  
  // Return as-is for international numbers
  return phone;
};

export const validateForm = (formData: FormData): FormErrors => {
  const errors: FormErrors = {};

  // Name validation
  if (!formData.name.trim()) {
    errors.name = 'Name is required';
  } else if (formData.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  // Email validation
  if (!formData.email.trim()) {
    errors.email = 'Email is required';
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  // Phone validation
  if (!formData.phone.trim()) {
    errors.phone = 'Phone number is required';
  } else if (!validatePhone(formData.phone)) {
    errors.phone = 'Please enter a valid phone number';
  }

  // Service Type validation
  if (!formData.serviceType) {
    errors.serviceType = 'Please select a service type';
  }

  // Budget validation
  if (!formData.budget) {
    errors.budget = 'Please select a budget range';
  }

  // Timeline validation
  if (!formData.timeline) {
    errors.timeline = 'Please select a timeline';
  }

  // Message validation
  if (!formData.message.trim()) {
    errors.message = 'Message is required';
  } else if (formData.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters';
  } else if (formData.message.length > 500) {
    errors.message = 'Message must be 500 characters or less';
  }

  return errors;
};
