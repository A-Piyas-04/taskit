import { db } from './firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

export const ErrorType = {
  Validation: 'validation',
  Database: 'database',
  API: 'api',
  Auth: 'auth',
  Unknown: 'unknown',
};

export async function logError({ userId = null, module, operation, context = {}, error, type = ErrorType.Unknown }) {
  const payload = {
    userId: userId || null,
    module,
    operation,
    type,
    message: error?.message || String(error),
    code: error?.code || null,
    context,
    timestamp: serverTimestamp(),
  };
  try {
    console.error(`[${module}:${operation}]`, { type, ...payload });
    // best-effort: write to logs collection
    await addDoc(collection(db, 'logs'), payload);
  } catch (e) {
    // avoid recursive logging; console only
    console.error('Failed to write log', e);
  }
}

export function logInfo(message, data = {}) {
  console.log(`[info] ${message}`, data);
}

