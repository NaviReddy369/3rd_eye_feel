import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { FormData } from '../types';
import { sendWelcomeEmail } from './emailService';

export const submitRequest = async (formData: FormData): Promise<string> => {
  try {
    const submission = {
      ...formData,
      status: 'new' as const,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'requests'), submission);

    // Send welcome email (non-blocking - don't fail form submission if email fails)
    sendWelcomeEmail(formData).catch((error) => {
      // Email send failure is logged but doesn't affect form submission
      console.error('Welcome email failed to send:', error);
    });

    return docRef.id;
  } catch (error) {
    console.error('Error submitting form:', error);
    throw new Error('Failed to submit your request. Please try again.');
  }
};
