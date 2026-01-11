import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { FormData } from '../types';

export const submitRequest = async (formData: FormData): Promise<string> => {
  try {
    const submission = {
      ...formData,
      status: 'new' as const,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'requests'), submission);
    return docRef.id;
  } catch (error) {
    console.error('Error submitting form:', error);
    throw new Error('Failed to submit your request. Please try again.');
  }
};
