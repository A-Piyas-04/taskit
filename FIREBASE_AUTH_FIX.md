# 🔧 Firebase Authentication Fix Guide

## 🔴 Problem Identified

Your TaskIt application deployed on Vercel (`taskit-8zuo.vercel.app`) is experiencing Google Sign-In failures due to:

```
FirebaseError: Firebase: Error (auth/unauthorized-domain)
```

**Root Cause:** The Vercel deployment domain is not authorized in Firebase Console for OAuth operations.

---

## ✅ Solution - Step-by-Step Fix

### **CRITICAL ACTION REQUIRED** (Do this first!)

You need to authorize your Vercel domain in Firebase Console:

#### Step 1: Open Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **taskit-ce7e0**

#### Step 2: Navigate to Authentication Settings
1. Click on **Authentication** in the left sidebar
2. Click on **Settings** tab (top of the page)
3. Click on **Authorized domains** tab

#### Step 3: Add Your Vercel Domain
1. Click the **Add domain** button
2. Enter your Vercel domain: `taskit-8zuo.vercel.app`
3. Click **Add**

#### Step 4: Also Add These (Recommended)
For better coverage, also add:
- `taskit-8zuo.vercel.app` (already added)
- `*.vercel.app` (if you want to allow all Vercel preview deployments)
- Any custom domains you plan to use

**By default, Firebase includes:**
- `localhost` (for local development)
- `taskit-ce7e0.firebaseapp.com` (your Firebase hosting domain)

---

## 🎯 Changes Made to the Codebase

### 1. **Updated Login Page** (`app/login/page.jsx`)

**Changes:**
- ✅ Removed email/password login form
- ✅ Removed signup/login toggle
- ✅ Simplified UI to show only Google Sign-In button
- ✅ Added better error handling with specific messages for auth errors
- ✅ Improved UX with feature highlights
- ✅ Maintained cyberpunk aesthetic

**Error Messages Now Include:**
- `auth/unauthorized-domain` → "Authentication domain not authorized. Please contact the administrator."
- `auth/popup-blocked` → "Popup was blocked. Please allow popups for this site."
- `auth/popup-closed-by-user` → "Sign-in cancelled."

### 2. **Backend Functions Remain Unchanged**

The following authentication functions in `lib/auth.js` are **still available** and working:
- `signInWithGoogle()` ✅ (Used in UI)
- `logInWithEmailAndPassword()` (Available but not exposed in UI)
- `registerWithEmailAndPassword()` (Available but not exposed in UI)
- `logout()` ✅
- `createUserProfileDocument()` ✅

This means you can still use email/password authentication programmatically or add it back to the UI in the future if needed.

---

## 🧪 Testing After Fix

Once you've added the domain to Firebase:

### 1. **Clear Browser Cache**
```bash
# Or use Ctrl+Shift+Delete in your browser
```

### 2. **Test Google Sign-In**
1. Visit your deployed site: `https://taskit-8zuo.vercel.app`
2. Click "Continue with Google"
3. Select your Google account
4. Should redirect to the dashboard successfully

### 3. **Check Firebase Console**
Go to Authentication → Users tab to verify the user was created.

### 4. **Check Firestore**
Go to Firestore Database → users collection to verify user document was created.

---

## 🔍 Additional Issues to Check

### Issue 1: Firestore Write Permissions

The error log also shows:
```
Failed to write log FirebaseError: Missing or insufficient permissions
```

This suggests your Firestore security rules might be blocking writes.

**Check Your Firestore Rules:**

Go to **Firestore Database** → **Rules** tab and update:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Categories collection
    match /categories/{categoryId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                     request.resource.data.userId == request.auth.uid;
    }
    
    // Tasks collection
    match /tasks/{taskId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
                     request.resource.data.userId == request.auth.uid;
    }
    
    // Logs collection (for error logging)
    match /logs/{logId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

**For development/testing only:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // ⚠️ Use only for testing!
    }
  }
}
```

### Issue 2: Check Authentication Provider Settings

1. Go to **Authentication** → **Sign-in method**
2. Ensure **Google** is **Enabled**
3. Make sure you've configured the OAuth consent screen properly

---

## 🚀 Deployment Checklist

- [x] Code updated to use Google-only authentication
- [ ] **Firebase domain authorization added** ← **DO THIS NOW!**
- [ ] Firestore security rules updated
- [ ] Google Sign-in method enabled in Firebase
- [ ] OAuth consent screen configured
- [ ] Changes deployed to Vercel
- [ ] Browser cache cleared
- [ ] Login tested on production

---

## 📝 Quick Reference

### Your Firebase Configuration
- **Project ID:** `taskit-ce7e0`
- **Auth Domain:** `taskit-ce7e0.firebaseapp.com`
- **Vercel Domain:** `taskit-8zuo.vercel.app`

### Domains to Authorize in Firebase
1. `localhost` (already included)
2. `taskit-ce7e0.firebaseapp.com` (already included)
3. `taskit-8zuo.vercel.app` ← **ADD THIS**
4. Any custom domains you have

---

## 🆘 Still Having Issues?

### Error: "Popup blocked"
**Solution:** Allow popups for your site in browser settings.

### Error: "Popup closed by user"
**Solution:** User cancelled the sign-in. This is normal behavior.

### Error: Still getting unauthorized-domain
**Solution:**
1. Double-check you added the exact domain: `taskit-8zuo.vercel.app`
2. Wait 5 minutes for Firebase to propagate changes
3. Clear browser cache completely
4. Try incognito mode

### Error: "Missing or insufficient permissions"
**Solution:** Update Firestore security rules as shown above.

---

## 📞 Support

If issues persist:
1. Check Firebase Console → Authentication → Users (see if users are being created)
2. Check browser console for detailed error messages
3. Check Firestore rules simulator
4. Verify OAuth consent screen is configured

---

**Last Updated:** 2025-11-29
**Status:** ✅ Code fixes applied, waiting for Firebase domain authorization
