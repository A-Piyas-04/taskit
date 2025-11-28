import {
    GoogleAuthProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    updateProfile
} from "firebase/auth";
import {
    doc,
    setDoc,
    getDoc,
    serverTimestamp
} from "firebase/firestore";
import { auth, db } from "./firebase";

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
    try {
        const res = await signInWithPopup(auth, googleProvider);
        const user = res.user;

        // Create user document if it doesn't exist
        await createUserProfileDocument(user);

        return user;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const logInWithEmailAndPassword = async (email, password) => {
    try {
        const res = await signInWithEmailAndPassword(auth, email, password);
        return res.user;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const registerWithEmailAndPassword = async (name, email, password) => {
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;

        // Update display name
        await updateProfile(user, { displayName: name });

        // Create user document
        await createUserProfileDocument(user, { displayName: name });

        return user;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const logout = () => {
    return signOut(auth);
};

export const createUserProfileDocument = async (userAuth, additionalData = {}) => {
    if (!userAuth) return;

    const userRef = doc(db, "users", userAuth.uid);
    const userSnapshot = await getDoc(userRef);

    if (!userSnapshot.exists()) {
        const { displayName, email, photoURL, uid } = userAuth;
        const createdAt = serverTimestamp();

        try {
            await setDoc(userRef, {
                uid,
                displayName,
                email,
                photoURL,
                createdAt,
                ...additionalData
            });
        } catch (error) {
            console.error("Error creating user", error);
        }
    }

    return userRef;
};
