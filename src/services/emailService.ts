import emailjs from '@emailjs/browser';
import { FormData } from '../types';
import { SERVICES } from '../config/services';

// Initialize EmailJS with public key
const initEmailJS = () => {
  const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;
  if (publicKey) {
    emailjs.init(publicKey);
  }
};

// Initialize on module load
initEmailJS();

/**
 * Sends a welcome email to the user after form submission
 * @param formData - The form data submitted by the user
 * @returns Promise<boolean> - Returns true if email sent successfully, false otherwise
 */
export const sendWelcomeEmail = async (formData: FormData): Promise<boolean> => {
  try {
    const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID;
    const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;

    // Check if EmailJS is configured
    if (!serviceId || !templateId || !process.env.REACT_APP_EMAILJS_PUBLIC_KEY) {
      console.warn('EmailJS not configured. Skipping email send.');
      return false;
    }

    // Validate email address
    if (!formData.email || !isValidEmail(formData.email)) {
      console.warn('Invalid email address. Skipping email send.');
      return false;
    }

    // Get service name for display
    const service = SERVICES.find(s => s.id === formData.serviceType);
    const serviceName = service?.name || formData.serviceType || 'Your Requested Service';

    // Format submission date
    const submissionDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    // Format budget for display
    const budgetDisplay = formatBudget(formData.budget);
    
    // Format timeline for display
    const timelineDisplay = formatTimeline(formData.timeline);

    // Prepare template parameters
    const templateParams = {
      user_name: formData.name,
      user_email: formData.email,
      service_type: serviceName,
      submission_date: submissionDate,
      budget_range: budgetDisplay,
      timeline: timelineDisplay,
      message: formData.message || 'No additional message provided.',
      to_email: formData.email, // Recipient email
    };

    // Send email
    await emailjs.send(
      serviceId,
      templateId,
      templateParams
    );

    console.log('Welcome email sent successfully to:', formData.email);
    return true;
  } catch (error) {
    // Log error but don't throw - form submission should still succeed
    console.error('Error sending welcome email:', error);
    return false;
  }
};

/**
 * Validates email address format
 * @param email - Email address to validate
 * @returns boolean - True if email is valid
 */
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Formats budget value for display in email
 * @param budget - Budget value from form
 * @returns string - Formatted budget string
 */
const formatBudget = (budget: string): string => {
  const budgetMap: { [key: string]: string } = {
    '500-1k': '$500 - $1,000',
    '1k-5k': '$1,000 - $5,000',
    '5k-10k': '$5,000 - $10,000',
    '10k-25k': '$10,000 - $25,000',
    '10k+': '$10,000+',
    '25k+': '$25,000+',
    'custom': 'Custom',
  };
  return budgetMap[budget] || budget || 'Not specified';
};

/**
 * Formats timeline value for display in email
 * @param timeline - Timeline value from form
 * @returns string - Formatted timeline string
 */
const formatTimeline = (timeline: string): string => {
  const timelineMap: { [key: string]: string } = {
    'asap': 'ASAP',
    '1-2-weeks': '1-2 weeks',
    '1-month': '1 month',
    '2-3-months': '2-3 months',
    '3-6-months': '3-6 months',
    'custom': 'Custom',
  };
  return timelineMap[timeline] || timeline || 'Not specified';
};
