import { db } from './firebase';
import { logError, ErrorType } from './logging';
import { validateCategoryName, validateTaskText } from './validation';
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
    serverTimestamp,
    writeBatch
} from 'firebase/firestore';

// ==================== CATEGORIES ====================

export const subscribeToCategories = (userId, callback) => {
    if (!userId) {
        callback([]);
        return () => { };
    }

    const q = query(
        collection(db, 'categories'),
        where('userId', '==', userId)
    );

    return onSnapshot(q, (snapshot) => {
        const categories = [];
        snapshot.forEach((doc) => {
            categories.push({ id: doc.id, ...doc.data() });
        });

        // Client-side sort to avoid composite index requirement
        categories.sort((a, b) => {
            const getMillis = (item) => {
                if (!item.createdAt) return Date.now(); // Assume new if pending
                if (typeof item.createdAt.toMillis === 'function') return item.createdAt.toMillis();
                return 0;
            };
            return getMillis(a) - getMillis(b);
        });

        callback(categories);
    }, (error) => {
        logError({ userId, module: 'categories', operation: 'subscribe', error, type: ErrorType.Database });
        callback([]);
    });
};

export const addCategory = async (userId, name, options = {}) => {
    if (!userId) return { success: false, error: 'User not authenticated', code: 'auth_required' };

    const v = validateCategoryName(name);
    if (!v.valid) return { success: false, error: v.error, code: 'validation_error' };

    try {
        // Enforce uniqueness per user by normalizedName
        const normalizedName = v.normalized;
        const dupQ = query(collection(db, 'categories'), where('userId', '==', userId), where('normalizedName', '==', normalizedName));
        const dupSnap = await getDocs(dupQ);
        if (!dupSnap.empty) {
            return { success: false, error: 'Category name already exists', code: 'duplicate_category' };
        }

        const docRef = await addDoc(collection(db, 'categories'), {
            userId,
            name: v.value,
            normalizedName,
            hidden: false,
            highlighted: !!options.highlighted,
            createdAt: serverTimestamp()
        });
        return { success: true, id: docRef.id };
    } catch (error) {
        await logError({ userId, module: 'categories', operation: 'add', context: { name }, error, type: ErrorType.Database });
        return { success: false, error: error.message, code: error.code || 'db_error' };
    }
};

export const unhideAllCategories = async (userId) => {
    try {
        const q = query(collection(db, 'categories'), where('userId', '==', userId), where('hidden', '==', true));
        const snap = await getDocs(q);
        if (snap.empty) return { success: true, updated: 0 };
        const chunkSize = 400;
        const docs = snap.docs;
        let updated = 0;
        for (let i = 0; i < docs.length; i += chunkSize) {
            const batch = writeBatch(db);
            const chunk = docs.slice(i, i + chunkSize);
            chunk.forEach(d => { batch.update(d.ref, { hidden: false }); updated++; });
            await batch.commit();
        }
        return { success: true, updated };
    } catch (error) {
        await logError({ userId, module: 'categories', operation: 'unhide_all', error, type: ErrorType.Database });
        return { success: false, error: error.message, code: error.code || 'db_error' };
    }
};

export const updateCategory = async (categoryId, updates) => {
    try {
        const categoryRef = doc(db, 'categories', categoryId);
        await updateDoc(categoryRef, updates);
        return { success: true };
    } catch (error) {
        await logError({ module: 'categories', operation: 'update', context: { categoryId, updates }, error, type: ErrorType.Database });
        return { success: false, error: error.message, code: error.code || 'db_error' };
    }
};

export const deleteCategory = async (categoryId, userId = null) => {
    try {
        const constraints = [where('categoryId', '==', categoryId)];
        if (userId) constraints.push(where('userId', '==', userId));
        const tasksQuery = query(collection(db, 'tasks'), ...constraints);
        const tasksSnapshot = await getDocs(tasksQuery);
        const taskDocs = tasksSnapshot.docs;

        const chunkSize = 400;
        if (taskDocs.length > 0) {
            for (let i = 0; i < taskDocs.length; i += chunkSize) {
                const batch = writeBatch(db);
                const chunk = taskDocs.slice(i, i + chunkSize);
                chunk.forEach(taskDoc => batch.delete(taskDoc.ref));
                if (i + chunkSize >= taskDocs.length) {
                    batch.delete(doc(db, 'categories', categoryId));
                }
                await batch.commit();
            }
        } else {
            const batch = writeBatch(db);
            batch.delete(doc(db, 'categories', categoryId));
            await batch.commit();
        }
        return { success: true };
    } catch (error) {
        await logError({ module: 'categories', operation: 'delete', context: { categoryId, userId }, error, type: ErrorType.Database });
        return { success: false, error: error.message, code: error.code || 'db_error' };
    }
};

// ==================== TASKS ====================

export const subscribeToTasks = (categoryId, callback, userId = null) => {
    const constraints = [where('categoryId', '==', categoryId)];
    if (userId) constraints.push(where('userId', '==', userId));
    const q = query(collection(db, 'tasks'), ...constraints);

    return onSnapshot(q, (snapshot) => {
        const tasks = [];
        snapshot.forEach((doc) => {
            tasks.push({ id: doc.id, ...doc.data() });
        });

        // Client-side sort to avoid composite index requirement
        tasks.sort((a, b) => {
            const getMillis = (item) => {
                if (!item.createdAt) return Date.now(); // Assume new if pending
                if (typeof item.createdAt.toMillis === 'function') return item.createdAt.toMillis();
                return 0;
            };
            return getMillis(a) - getMillis(b);
        });

        callback(tasks);
    }, (error) => {
        logError({ module: 'tasks', operation: 'subscribe', context: { categoryId, userId }, error, type: ErrorType.Database });
        callback([]);
    });
};

export const addTask = async (userId, categoryId, text) => {
    if (!userId) return { success: false, error: 'User not authenticated', code: 'auth_required' };
    const v = validateTaskText(text);
    if (!v.valid) return { success: false, error: v.error, code: 'validation_error' };

    try {
        const docRef = await addDoc(collection(db, 'tasks'), {
            userId,
            categoryId,
            text: v.value,
            completed: false,
            highlighted: false,
            createdAt: serverTimestamp()
        });
        return { success: true, id: docRef.id };
    } catch (error) {
        await logError({ userId, module: 'tasks', operation: 'add', context: { categoryId }, error, type: ErrorType.Database });
        return { success: false, error: error.message, code: error.code || 'db_error' };
    }
};

export const updateTask = async (taskId, updates) => {
    try {
        const taskRef = doc(db, 'tasks', taskId);
        await updateDoc(taskRef, updates);
        return { success: true };
    } catch (error) {
        await logError({ module: 'tasks', operation: 'update', context: { taskId, updates }, error, type: ErrorType.Database });
        return { success: false, error: error.message, code: error.code || 'db_error' };
    }
};

export const deleteTask = async (taskId) => {
    try {
        await deleteDoc(doc(db, 'tasks', taskId));
        return { success: true };
    } catch (error) {
        await logError({ module: 'tasks', operation: 'delete', context: { taskId }, error, type: ErrorType.Database });
        return { success: false, error: error.message, code: error.code || 'db_error' };
    }
};

// ==================== BULK OPERATIONS ====================

export const getAllTasksForCategory = async (categoryId) => {
    try {
        const q = query(collection(db, 'tasks'), where('categoryId', '==', categoryId));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        await logError({ module: 'tasks', operation: 'list_all', context: { categoryId }, error, type: ErrorType.Database });
        return [];
    }
};

export const toggleTaskCompletion = async (taskId, currentStatus) => {
    return updateTask(taskId, { completed: !currentStatus });
};

export const toggleTaskHighlight = async (taskId, currentStatus) => {
    return updateTask(taskId, { highlighted: !currentStatus });
};
