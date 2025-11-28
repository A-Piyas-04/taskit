# 🚀 TaskIt Deployment Guide

Complete step-by-step guide to deploy TaskIt to production.

---

## 📋 Pre-Deployment Checklist

Before deploying, ensure:
- [x] All features tested locally
- [x] Firebase project created
- [x] Environment variables prepared
- [x] Git repository initialized
- [x] No console errors during `npm run build`

---

## 🔥 Firebase Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Name it "TaskIt" (or your preferred name)
4. Disable Google Analytics (optional for this project)
5. Click "Create Project"

### Step 2: Enable Firestore

1. In Firebase Console, go to **Firestore Database**
2. Click "Create Database"
3. Choose **Start in test mode** for development
4. Select your preferred region (closest to your users)
5. Click "Enable"

### Step 3: Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll to **Your apps** section
3. Click **Web** icon (</>)
4. Register app with name "TaskIt Web"
5. Copy the `firebaseConfig` object

### Step 4: Configure Security Rules

In Firestore Database → Rules tab, paste:

**For Development:**
\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
\`\`\`

**For Production (with auth):**
\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /categories/{categoryId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                     request.auth.uid == resource.data.userId;
    }
    
    match /tasks/{taskId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
\`\`\`

---

## 🌐 Vercel Deployment

### Option 1: Deploy via Git (Recommended)

#### 1. **Initialize Git Repository**
\`\`\`bash
cd taskit
git init
git add .
git commit -m "Initial commit: TaskIt v1.0"
\`\`\`

#### 2. **Push to GitHub**
\`\`\`bash
# Create a new repository on GitHub first
git remote add origin https://github.com/YOUR_USERNAME/taskit.git
git branch -M main
git push -u origin main
\`\`\`

#### 3. **Deploy on Vercel**

1. Go to [Vercel](https://vercel.com)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./taskit` (if nested)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

5. **Add Environment Variables:**
   Click "Environment Variables" and add:
   \`\`\`
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   \`\`\`

6. Click "Deploy"

### Option 2: Deploy via Vercel CLI

\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd taskit
vercel

# Follow the prompts:
# - Set up and deploy? → Yes
# - Which scope? → Your account
# - Link to existing project? → No
# - Project name? → taskit
# - Directory? → ./
# - Override settings? → No

# Add environment variables
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
# ... repeat for all variables

# Deploy to production
vercel --prod
\`\`\`

---

## 🎯 Post-Deployment Steps

### 1. **Test the Live Site**

Visit your Vercel URL (e.g., `taskit.vercel.app`) and test:
- [x] Create a category
- [x] Add tasks
- [x] Toggle complete/highlight
- [x] Edit and delete
- [x] Keyboard shortcuts
- [x] Responsive layout on mobile
- [x] Check Firebase Console for data

### 2. **Custom Domain (Optional)**

1. In Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Update DNS records as instructed
5. Wait for SSL certificate (automatic)

### 3. **Performance Monitoring**

1. Enable **Web Vitals** in Vercel dashboard
2. Check Lighthouse scores:
   \`\`\`bash
   npm install -g lighthouse
   lighthouse https://your-domain.vercel.app
   \`\`\`

### 4. **Error Tracking (Optional)**

Integrate Sentry for error monitoring:
\`\`\`bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
\`\`\`

---

## 🔐 Production Security

### 1. **Enable Firebase Authentication**

\`\`\`bash
# In Firebase Console:
# 1. Go to Authentication
# 2. Set up sign-in method (Email, Google, etc.)
# 3. Update Firestore rules to require auth
\`\`\`

### 2. **Environment Variables Security**

- ✅ Never commit `.env.local` to Git
- ✅ Use Vercel environment variables
- ✅ Rotate API keys if exposed
- ✅ Enable Firebase App Check for production

### 3. **Firestore Security**

Update rules to enforce user ownership:
\`\`\`javascript
match /categories/{categoryId} {
  allow create: if request.auth != null;
  allow read, update, delete: if request.auth != null && 
                                  resource.data.userId == request.auth.uid;
}
\`\`\`

---

## 📊 Monitoring & Analytics

### Vercel Analytics
\`\`\`bash
# Enable in Vercel dashboard
# No code changes needed
\`\`\`

### Google Analytics (Optional)
\`\`\`javascript
// Add to app/layout.jsx
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
      <GoogleAnalytics gaId="G-XXXXXXXXXX" />
    </html>
  )
}
\`\`\`

---

## 🐛 Troubleshooting

### Build Fails

\`\`\`bash
# Clear caches
rm -rf .next node_modules
npm install
npm run build
\`\`\`

### Firebase Connection Issues

- Verify environment variables are set in Vercel
- Check Firebase project status
- Review Firestore security rules
- Check browser console for CORS errors

### Deployment Not Updating

\`\`\`bash
# Force rebuild in Vercel
# or
vercel --force
\`\`\`

---

## 🚀 Alternative Deployment Platforms

### Netlify
\`\`\`bash
npm install -g netlify-cli
netlify init
netlify deploy --prod
\`\`\`

### Railway
\`\`\`bash
npm install -g @railway/cli
railway init
railway up
\`\`\`

### AWS Amplify
1. Connect GitHub repository
2. Add environment variables
3. Deploy

---

## 📈 Performance Optimization

### 1. **Image Optimization**
\`\`\`javascript
// Use Next.js Image component
import Image from 'next/image'
\`\`\`

### 2. **Enable Compression**
Already enabled by Vercel/Next.js

### 3. **CDN Caching**
Automatic with Vercel Edge Network

### 4. **Code Splitting**
Automatic with Next.js App Router

---

## 🎉 Going Live Checklist

- [ ] Firebase project configured
- [ ] Environment variables set in Vercel
- [ ] Build passes locally (`npm run build`)
- [ ] Deployed to Vercel
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] Firestore security rules updated
- [ ] All features tested on production
- [ ] Error monitoring enabled
- [ ] Analytics configured
- [ ] Performance optimized (Lighthouse > 90)
- [ ] Mobile responsiveness verified
- [ ] Keyboard shortcuts work
- [ ] Toast notifications appear
- [ ] Real-time sync working

---

## 📞 Support Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Firebase Docs](https://firebase.google.com/docs)
- [TailwindCSS Docs](https://tailwindcss.com/docs)

---

## 🎊 Congratulations!

Your TaskIt application is now live and ready for users!

**Your site is at**: `https://taskit.vercel.app` (or your custom domain)

**Next steps:**
1. Share with users
2. Collect feedback
3. Iterate and improve
4. Add premium features

---

**Happy deploying! 🚀**
