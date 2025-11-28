import { db } from './firebase';
import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    onSnapshot,
    serverTimestamp
} from 'firebase/firestore';

// ==================== CATEGORIES ====================

export const subscribeToCategories = (callback) => {
    const q = query(collection(db, 'categories'), orderBy('createdAt', 'asc'));
    return onSnapshot(q, (snapshot) => {
        const categories = [];
        snapshot.forEach((doc) => {
            categories.push({ id: doc.id, ...doc.data() });
        });
        callback(categories);
    }, (error) => {
        console.error('Error subscribing to categories:', error);
        callback([]);
    });
};

export const addCategory = async (name) => {
    try {
        const docRef = await addDoc(collection(db, 'categories'), {
            name,
            hidden: false,
            createdAt: serverTimestamp()
        });
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error('Error adding category:', error);
        return { success: false, error: error.message };
    }
};

export const updateCategory = async (categoryId, updates) => {
    try {
        const categoryRef = doc(db, 'categories', categoryId);
        await updateDoc(categoryRef, updates);
        return { success: true };
    } catch (error) {
        console.error('Error updating category:', error);
        return { success: false, error: error.message };
    }
};

export const deleteCategory = async (categoryId) => {
    try {
        // Delete all tasks in this category first
        const tasksQuery = query(collection(db, 'tasks'), where('categoryId', '==', categoryId));
        const tasksSnapshot = await getDocs(tasksQuery);
        const deletePromises = tasksSnapshot.docs.map(taskDoc => deleteDoc(taskDoc.ref));
        await Promise.all(deletePromises);

        // Delete the category
        await deleteDoc(doc(db, 'categories', categoryId));
        return { success: true };
    } catch (error) {
        console.error('Error deleting category:', error);
        return { success: false, error: error.message };
    }
};

// ==================== TASKS ====================

export const subscribeToTasks = (categoryId, callback) => {
    const q = query(
        collection(db, 'tasks'),
        where('categoryId', '==', categoryId),
        orderBy('createdAt', 'asc')
    );

    return onSnapshot(q, (snapshot) => {
        const tasks = [];
        snapshot.forEach((doc) => {
            tasks.push({ id: doc.id, ...doc.data() });
        });
        callback(tasks);
    }, (error) => {
        console.error('Error subscribing to tasks:', error);
        callback([]);
    });
};

export const addTask = async (categoryId, text) => {
    try {
        const docRef = await addDoc(collection(db, 'tasks'), {
            categoryId,
            text,
            completed: false,
            highlighted: false,
            createdAt: serverTimestamp()
        });
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error('Error adding task:', error);
        return { success: false, error: error.message };
    }
};

export const updateTask = async (taskId, updates) => {
    try {
        const taskRef = doc(db, 'tasks', taskId);
        await updateDoc(taskRef, updates);
        return { success: true };
    } catch (error) {
        console.error('Error updating task:', error);
        return { success: false, error: error.message };
    }
};

export const deleteTask = async (taskId) => {
    try {
        await deleteDoc(doc(db, 'tasks', taskId));
        return { success: true };
    } catch (error) {
        console.error('Error deleting task:', error);
        return { success: false, error: error.message };
    }
};

// ==================== BULK OPERATIONS ====================

export const getAllTasksForCategory = async (categoryId) => {
    try {
        const q = query(collection(db, 'tasks'), where('categoryId', '==', categoryId));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error getting tasks:', error);
        return [];
    }
};

export const toggleTaskCompletion = async (taskId, currentStatus) => {
    return updateTask(taskId, { completed: !currentStatus });
};

export const toggleTaskHighlight = async (taskId, currentStatus) => {
    return updateTask(taskId, { highlighted: !currentStatus });
};
