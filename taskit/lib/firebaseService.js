import { db } from './firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where, onSnapshot, orderBy } from 'firebase/firestore';

// Categories
export const subscribeToCategories = (callback) => {
    const q = query(collection(db, 'categories'), orderBy('createdAt', 'asc'));
    return onSnapshot(q, (snapshot) => {
        const categories = [];
        snapshot.forEach((doc) => {
            categories.push({ id: doc.id, ...doc.data() });
        });
        callback(categories);
    });
};

export const addCategory = async (name) => {
    await addDoc(collection(db, 'categories'), {
        name,
        visible: true,
        createdAt: new Date()
    });
};

export const deleteCategory = async (categoryId) => {
    await deleteDoc(doc(db, 'categories', categoryId));
}

// Tasks
export const subscribeToTasks = (categoryId, callback) => {
    const q = query(collection(db, 'tasks'), where('categoryId', '==', categoryId));
    // Note: Compound queries might require an index. For now, we sort client-side or add index if needed.
    return onSnapshot(q, (snapshot) => {
        const tasks = [];
        snapshot.forEach((doc) => {
            tasks.push({ id: doc.id, ...doc.data() });
        });
        // Simple client-side sort by createdAt if needed, or rely on default
        tasks.sort((a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0));
        callback(tasks);
    });
};

export const addTask = async (categoryId, text) => {
    await addDoc(collection(db, 'tasks'), {
        categoryId,
        text,
        status: 'pending',
        highlighted: false,
        createdAt: new Date()
    });
};

export const updateTask = async (taskId, updates) => {
    const taskRef = doc(db, 'tasks', taskId);
    await updateDoc(taskRef, updates);
};

export const deleteTask = async (taskId) => {
    await deleteDoc(doc(db, 'tasks', taskId));
};
