import React, { useState } from 'react';
import { NOTION_GUIDES } from '../config/notionGuides';
import { submitEnrollment } from '../services/enrollmentService';
import Button from '../components/Button';
import Toast from '../components/Toast';
import { validateEmail } from '../utils/formValidation';

const EnrollGuides: React.FC = () => {
  const [selectedGuideIds, setSelectedGuideIds] = useState<string[]>([]);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | undefined>();
  const [guidesError, setGuidesError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [showSuccess, setShowSuccess] = useState(false);

  const freeGuides = NOTION_GUIDES.filter((g) => g.isFree);

  const toggleGuide = (id: string) => {
    setSelectedGuideIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
    if (guidesError) setGuidesError(undefined);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;
    if (selectedGuideIds.length === 0) {
      setGuidesError('Please select at least one guide.');
      hasError = true;
    } else {
      setGuidesError(undefined);
    }
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setEmailError('Email is required.');
      hasError = true;
    } else if (!validateEmail(trimmedEmail)) {
      setEmailError('Please enter a valid email address.');
      hasError = true;
    } else {
      setEmailError(undefined);
    }
    if (hasError) return;

    setIsSubmitting(true);
    try {
      await submitEnrollment({ email: trimmedEmail, guideIds: selectedGuideIds });
      setShowSuccess(true);
    } catch (err) {
      setToastMessage('Something went wrong. Please try again.');
      setToastType('error');
      setShowToast(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-tech-dark relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 max-w-2xl">
          <div
            className="rounded-xl border border-tech-border p-8 text-center"
            style={{ background: 'rgba(26, 26, 26, 0.8)' }}
          >
            <h2 className="text-xl font-semibold text-tech-text mb-4">You're enrolled</h2>
            <p className="text-tech-text-muted">
              Check your email for the guide links. If you don't see it, check your spam folder.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-tech-dark relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 max-w-3xl">
        <h1
          className="text-2xl sm:text-3xl font-bold mb-2"
          style={{
            color: '#5ec8e0',
            textShadow: '0 0 20px rgba(0, 217, 255, 0.2)',
          }}
        >
          Enroll for implementation guides
        </h1>
        <p className="text-tech-text-muted mb-8">
          Choose the guides you want. We’ll send the Notion links to your email so you can follow step-by-step. Free to enroll.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <p className="text-sm font-semibold text-tech-text mb-3">Choose guides</p>
            {guidesError && (
              <p className="text-red-400 text-sm mb-2" role="alert">
                {guidesError}
              </p>
            )}
            <div className="space-y-3">
              {freeGuides.map((guide) => (
                <label
                  key={guide.id}
                  className={`
                    flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors
                    ${selectedGuideIds.includes(guide.id) ? 'border-tech-cyan/50 bg-tech-gray/50' : 'border-tech-border bg-tech-gray/30 hover:border-tech-border-hover'}
                  `}
                >
                  <input
                    type="checkbox"
                    checked={selectedGuideIds.includes(guide.id)}
                    onChange={() => toggleGuide(guide.id)}
                    className="mt-1 w-4 h-4 rounded border-tech-border text-tech-cyan focus:ring-tech-cyan/50"
                    aria-describedby={`guide-desc-${guide.id}`}
                  />
                  <div id={`guide-desc-${guide.id}`}>
                    <span className="font-medium text-tech-text block">{guide.title}</span>
                    <span className="text-sm text-tech-text-muted">{guide.description}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="enroll-email" className="block text-sm font-semibold text-tech-text mb-2">
              Email
            </label>
            <input
              id="enroll-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError(undefined);
              }}
              placeholder="you@example.com"
              className={`
                w-full px-4 py-3 rounded-lg bg-tech-gray border text-tech-text placeholder-tech-text-muted
                focus:bg-tech-gray-light focus:border-tech-cyan/50 focus:outline-none focus:ring-2 focus:ring-tech-cyan/20
                ${emailError ? 'border-red-500/60' : 'border-tech-border'}
              `}
              aria-invalid={!!emailError}
              aria-describedby={emailError ? 'enroll-email-error' : undefined}
            />
            {emailError && (
              <p id="enroll-email-error" className="text-red-400 text-sm mt-1" role="alert">
                {emailError}
              </p>
            )}
          </div>

          <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
            Get access
          </Button>
        </form>
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

export default EnrollGuides;
