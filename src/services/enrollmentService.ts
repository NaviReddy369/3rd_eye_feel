import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export interface EnrollmentPayload {
  email: string;
  guideIds: string[];
}

/**
 * Submits a guide enrollment. The Cloud Function trigger will send the user
 * an email with the Notion guide link(s). Client only writes to enrollments.
 */
export async function submitEnrollment(payload: EnrollmentPayload): Promise<string> {
  const { email, guideIds } = payload;
  const docRef = await addDoc(collection(db, 'enrollments'), {
    email,
    guideIds,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}
