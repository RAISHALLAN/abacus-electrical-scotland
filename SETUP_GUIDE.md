# Quick Setup Guide - Abacus Electrical Scotland Website

## ✅ What's Been Created

I've created a complete website foundation with:

### Project Files
- React + Vite project structure
- Dark theme CSS with white text (modern, minimal design)
- 7 pages: Home, Services, Gallery, Before/After, Contact, Admin, 404
- Responsive layout (mobile, tablet, desktop)
- Company logo integrated

### Components
- **Layout** - Header, navigation, footer
- **QuoteForm** - Customer quote request form
- **Testimonials** - Display testimonials with submission form
- **Promotions** - Display special offers

### Backend (Netlify Functions)
- **sendEmail.js** - Email sending via Resend API
- **adminAuth.js** - Admin password verification
- **generateQuote.js** - PDF quote generation and emailing

### Utils
- Firebase configuration setup
- PDF generator utility with jsPDF

### Documentation
- README.md with full project details
- This setup guide

---

## 🚀 Next Steps - Getting It Running

### Step 1: Install Dependencies
```bash
cd "C:\Users\raish\Desktop\Claude Projects\Website - Abacus"
npm install
```

This installs:
- React, React Router
- Firebase SDK
- jsPDF for PDF generation
- Vite for fast development

### Step 2: Create `.env.local` File

Copy `.env.example` to `.env.local` and add your values:

```bash
# Copy the file
cp .env.example .env.local
```

Edit `.env.local` with:

**Firebase Configuration:**
1. Go to [firebase.google.com](https://firebase.google.com)
2. Create a new project (free tier)
3. Create a Realtime Database
4. Get your config from Project Settings > General
5. Add to `.env.local`:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
```

**Resend Email API:**
1. Sign up at [resend.com](https://resend.com) (free tier: 100 emails/day)
2. Get your API key
3. Add to `.env.local`:
```
RESEND_API_KEY=re_xxxxxxxxxx
```

**Admin Password:**
```
VITE_ADMIN_PASSWORD=your_secure_password_here
```

**Company Details:**
```
VITE_COMPANY_NAME=Abacus Electrical Scotland
VITE_COMPANY_EMAIL=your_email@abacuselectrical.co.uk
VITE_COMPANY_PHONE=+44 (0) XXXX XXXXX
VITE_COMPANY_ADDRESS=Your Address, Scotland
```

### Step 3: Run Locally

```bash
npm run dev
```

This starts the development server at `http://localhost:3000`

---

## 🔥 Current Status

### ✅ Complete (Phases 1-3)
- [x] Project setup and configuration
- [x] Dark theme styling (black background, white text)
- [x] All public pages created
- [x] Home page with qualifications section
- [x] Services page (4 categories)
- [x] Contact page
- [x] Gallery page
- [x] Before/After page
- [x] Layout with header, nav, footer
- [x] Responsive design

### 🔄 In Progress (Phase 4)
- [x] Quote form component
- [ ] Form submission to Firebase
- [ ] Email confirmation to customers

### ⏳ To Do (Phases 5-12)
- [ ] Admin authentication & dashboard
- [ ] Admin panels for work types, costs, testimonials, promotions
- [ ] PDF quote generation with logo
- [ ] Auto-email functionality
- [ ] Firebase integration for all data
- [ ] Netlify deployment setup
- [ ] Final testing

---

## 📝 Feature Overview

### Public Website
- **Landing Page**: Hero section with qualifications and CTA
- **Services**: 4 main service categories with details
- **Gallery**: Showcase of work (placeholder images)
- **Before/After**: Project transformations
- **Testimonials**: Customer reviews with 5-star ratings + public submission form
- **Promotions**: Display active special offers
- **Contact**: Contact form + quote request form

### Admin Panel
- Password-protected dashboard
- Manage work types (add/edit/delete)
- Manage materials & labour costs
- Generate professional quote PDFs with logo
- Auto-email quotes to customers
- Approve/reject testimonials
- Manage promotional offers
- Review quote requests

---

## 🎨 Design Details

**Dark Theme:**
- Black background (#000000)
- White text (#FFFFFF)
- Orange accent color (#ff6b35)
- Minimal, modern design
- Full responsive design

**Logo:**
- Used in header and footer
- Integrated into PDF quotes
- File: `public/Abacus Logo.jpeg`

---

## 📋 Firebase Setup

Create these collections in Firebase Realtime Database:

1. **workTypes** - Store types of work
   ```
   {
     "domestic-wiring": { "name": "Domestic Wiring", "description": "..." },
     "commercial": { "name": "Commercial Installation", "description": "..." }
   }
   ```

2. **materials** - Materials with costs
   ```
   {
     "cable-1": { "name": "Basic Cable (per meter)", "cost": 2.50 },
     "socket": { "name": "Socket", "cost": 15.00 }
   }
   ```

3. **labour** - Labour rates
   ```
   {
     "call-out": { "name": "Call Out Fee", "cost": 75.00 },
     "hourly": { "name": "Per Hour", "cost": 50.00 }
   }
   ```

4. **testimonials** - Customer reviews
   ```
   {
     "test-1": {
       "name": "John Smith",
       "rating": 5,
       "text": "Great work!",
       "approved": true,
       "date": "2024-01-15"
     }
   }
   ```

5. **promotions** - Special offers
   ```
   {
     "promo-1": {
       "title": "Spring Special",
       "description": "10% off work",
       "discount": "10%",
       "validUntil": "2024-05-31",
       "active": true
     }
   }
   ```

6. **quoteRequests** - Customer quote requests
7. **generatedQuotes** - Stored quotes

---

## 🌐 Deployment to Netlify

When ready to deploy:

1. Create GitHub repository
2. Push code to GitHub
3. Connect repo to Netlify
4. Add environment variables in Netlify settings
5. Deploy (auto-builds on push)

Free tier includes:
- Unlimited sites
- 125,000 Netlify Functions calls/month
- 100 GB bandwidth/month

---

## 🛠 Troubleshooting

**Common Issues:**

1. **"Cannot find module 'firebase'"**
   - Run `npm install`

2. **Port 3000 already in use**
   - Kill the process or use different port: `npm run dev -- --port 3001`

3. **Firebase config errors**
   - Check `.env.local` file exists with correct values
   - Verify Firebase project is created

4. **Email not sending**
   - Check Resend API key is correct
   - Verify email address format is valid

---

## 📞 Next Steps

1. **Set up Firebase** (highest priority)
2. **Get Resend API key** for emails
3. **Run `npm install` and test locally**
4. **Create GitHub repo**
5. **Connect to Netlify for deployment**

Once setup is complete, I can help with:
- Firebase integration for data
- Admin panel functionality
- PDF quote generation
- Email automation
- Deployment & testing

---

## 📚 Useful Links

- [Firebase Console](https://firebase.google.com)
- [Resend Email](https://resend.com)
- [Netlify](https://netlify.com)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)

---

## ⚡ Quick Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

You're all set! Let me know when you've set up Firebase and Resend, and we'll integrate them with the website. 🚀
