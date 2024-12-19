import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const app = initializeApp(); // Firebase-configuratie wordt automatisch geladen
const db = getFirestore(app);

export { db };
