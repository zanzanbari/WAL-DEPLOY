import * as admin from 'firebase-admin';
import * as serviceAccount from '../firebase-admin.json';

export const firebaseApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
});