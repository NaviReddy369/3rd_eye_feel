import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FormField from '../components/FormField';
import Button from '../components/Button';
import Toast from '../components/Toast';
import { submitRequest } from '../services/formService';
import { validateForm, formatPhone, validateEmail, validatePhone } from '../utils/formValidation';
import { FormData, FormErrors } from '../types';
import { SERVICES } from '../config/services';

const ServiceForm: React.FC = () => {
  const navigate = useNavigate();
  const { serviceId } = useParams<{ serviceId: string }>();
  
  const service = SERVICES.find(s => s.id === serviceId);
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    serviceType: serviceId || '',
    budget: '',
    timeline: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [showSuccess, setShowSuccess] = useState(false);

  // Initialize custom fields
  useEffect(() => {
    if (service?.customFields) {
      const initialCustomFields: { [key: string]: string } = {};
      service.customFields.forEach(field => {
        initialCustomFields[field.name] = '';
      });
      setFormData(prev => ({ ...prev, ...initialCustomFields }));
    }
  }, [service]);

  // Redirect if service not found
  useEffect(() => {
    if (!service) {
      navigate('/');
    }
  }, [service, navigate]);

  const budgetOptions = [
    { value: '500-1k', label: '$500 - $1,000' },
    { value: '1k-5k', label: '$1,000 - $5,000' },
    { value: '5k-10k', label: '$5,000 - $10,000' },
    { value: '10k-25k', label: '$10,000 - $25,000' },
    { value: '25k+', label: '$25,000+' },
    { value: 'custom', label: 'Custom' },
  ];

  const timelineOptions = [
    { value: 'asap', label: 'ASAP' },
    { value: '1-2-weeks', label: '1-2 weeks' },
    { value: '1-month', label: '1 month' },
    { value: '2-3-months', label: '2-3 months' },
    { value: '3-6-months', label: '3-6 months' },
    { value: 'custom', label: 'Custom' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Format phone number as user types
    if (name === 'phone') {
      const formatted = formatPhone(value);
      setFormData(prev => ({ ...prev, [name]: formatted }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Validate custom fields
    if (service?.customFields) {
      const customField = service.customFields.find(f => f.name === name);
      if (customField?.validation) {
        const error = customField.validation(value);
        if (error) {
          setErrors(prev => ({ ...prev, [name]: error }));
          return;
        }
      }
    }
    
    const fieldErrors = validateForm({ ...formData, [name]: value });
    if (fieldErrors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: fieldErrors[name as keyof FormErrors] }));
    }
  };

  const validateServiceForm = (data: FormData): FormErrors => {
    const baseErrors = validateForm(data);
    const serviceErrors: FormErrors = { ...baseErrors };

    // Validate custom fields
    if (service?.customFields) {
      service.customFields.forEach(field => {
        const value = data[field.name] || '';
        
        if (field.required && !value.trim()) {
          serviceErrors[field.name] = `${field.label} is required`;
        } else if (field.validation && value.trim()) {
          const error = field.validation(value);
          if (error) {
            serviceErrors[field.name] = error;
          }
        }
      });
    }

    return serviceErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateServiceForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      
      // Scroll to first error
      const firstErrorField = Object.keys(validationErrors)[0];
      const errorElement = document.getElementById(firstErrorField);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        errorElement.focus();
      }
      
      setToastMessage('Please fix the errors in the form');
      setToastType('error');
      setShowToast(true);
      return;
    }

    setIsSubmitting(true);
    try {
      await submitRequest(formData);
      setShowSuccess(true);
      setToastMessage('Your request has been submitted successfully! We will contact you soon.');
      setToastType('success');
      setShowToast(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        const resetData: FormData = {
          name: '',
          email: '',
          phone: '',
          serviceType: serviceId || '',
          budget: '',
          timeline: '',
          message: '',
        };
        
        if (service?.customFields) {
          service.customFields.forEach(field => {
            resetData[field.name] = '';
          });
        }
        
        setFormData(resetData);
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      setToastMessage(error instanceof Error ? error.message : 'Failed to submit request. Please try again.');
      setToastType('error');
      setShowToast(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!service) {
    return null;
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-tech-dark flex items-center justify-center px-4 sm:px-6 py-6 sm:py-8">
        <div className="glass rounded-lg p-6 sm:p-8 md:p-12 max-w-md w-full text-center animate-scaleIn border border-tech-border">
          <div className="text-5xl sm:text-6xl mb-4">✅</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-tech-text mb-4">Success!</h2>
          <p className="text-sm sm:text-base text-tech-text-muted mb-6 leading-relaxed px-2">
            Your request for <span className="font-semibold text-tech-cyan">{service.name}</span> has been submitted. Our team will reach out to you within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button 
              onClick={() => setShowSuccess(false)} 
              variant="secondary"
              className="w-full sm:w-auto min-h-[44px] touch-manipulation"
            >
              Submit Another
            </Button>
            <Button 
              onClick={() => navigate('/')} 
              variant="outline"
              className="w-full sm:w-auto min-h-[44px] touch-manipulation"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-tech-dark py-6 sm:py-8 md:py-12 px-4 sm:px-6">
      <div className="container mx-auto max-w-2xl">
        <div className="glass rounded-lg p-4 sm:p-6 md:p-8 animate-fadeIn border border-tech-border">
          <div className="mb-6 sm:mb-8">
            <button
              onClick={() => navigate('/')}
              className="text-tech-text-muted hover:text-tech-cyan mb-4 flex items-center gap-2 transition-colors text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-tech-cyan/50 rounded-lg px-2 py-1 -ml-2"
              aria-label="Navigate back to home"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </button>
            <div className="flex items-center gap-3 sm:gap-4 mb-4">
              <span className="text-3xl sm:text-4xl">{service.icon}</span>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-tech-text mb-2">
                  Request: {service.name}
                </h1>
                <p className="text-sm sm:text-base text-tech-text-muted leading-relaxed">
                  Fill out the form below and our team will get back to you soon.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            <FormField
              label="Full Name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.name}
              required
              placeholder="John Doe"
            />

            <FormField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.email}
              required
              placeholder="john@example.com"
            />

            <FormField
              label="Phone Number"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.phone}
              required
              placeholder="(555) 123-4567"
            />

            {/* Custom Service Fields */}
            {service.customFields?.map((field) => (
              <FormField
                key={field.name}
                label={field.label}
                name={field.name}
                type={field.type as 'text' | 'textarea' | 'select' | 'number'}
                value={formData[field.name] || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors[field.name]}
                required={field.required}
                placeholder={field.placeholder}
                options={field.options}
                rows={field.type === 'textarea' ? 4 : undefined}
              />
            ))}

            <FormField
              label="Budget Range"
              name="budget"
              type="select"
              value={formData.budget}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.budget}
              required
              placeholder="Select budget range"
              options={budgetOptions}
            />

            <FormField
              label="Timeline"
              name="timeline"
              type="select"
              value={formData.timeline}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.timeline}
              required
              placeholder="Select timeline"
              options={timelineOptions}
            />

            <FormField
              label="Project Details"
              name="message"
              type="textarea"
              value={formData.message}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.message}
              required
              placeholder="Tell us about your project requirements, goals, and any additional information..."
              maxLength={1000}
              rows={6}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              className="w-full min-h-[48px] sm:min-h-[52px] touch-manipulation"
            >
              Submit Request
            </Button>
          </form>
        </div>
      </div>

      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
};

export default ServiceForm;
