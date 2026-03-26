# Abacus Electrical Scotland - Website

A professional website for Abacus Electrical Scotland, a fully qualified and certified electrician business serving Scotland.

## Features

### Public Website
- Professional landing page with qualifications and certifications
- Services overview (Domestic, Commercial, Testing & Inspection, Maintenance)
- Gallery of completed projects
- Before & After project showcase
- Client testimonials (with public submission form)
- Special offers/promotions section
- Contact page with free quote request form
- Dark theme with minimal, modern design

### Admin Panel
- Password-protected admin dashboard
- Manage work types (add/edit/delete)
- Standardized materials and labour costs
- Generate professional quote PDFs with company logo
- Auto-email quotes to customers
- Approve/reject customer testimonials
- Manage promotional offers
- Review quote requests

## Tech Stack

- **Frontend**: React 18 + Vite
- **Routing**: React Router DOM
- **Database**: Firebase Realtime Database
- **Backend**: Netlify Functions (serverless)
- **PDF Generation**: jsPDF
- **Hosting**: Netlify (free tier)
- **Email**: Resend API (free tier)

## Project Structure

```
website-abacus/
├── public/
│   └── Abacus Logo.jpeg
├── src/
│   ├── components/
│   │   ├── Layout.jsx
│   │   ├── QuoteForm.jsx
│   │   ├── Testimonials.jsx
│   │   └── Promotions.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Services.jsx
│   │   ├── Contact.jsx
│   │   ├── Gallery.jsx
│   │   ├── BeforeAfter.jsx
│   │   ├── Admin.jsx
│   │   └── NotFound.jsx
│   ├── utils/
│   │   ├── firebase.js
│   │   └── pdfGenerator.js
│   ├── styles/
│   │   └── main.css
│   ├── App.jsx
│   └── main.jsx
├── netlify/
│   └── functions/
│       ├── sendEmail.js
│       ├── generateQuote.js
│       └── adminAuth.js
├── index.html
├── package.json
├── vite.config.js
├── netlify.toml
└── .env.example
```

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Firebase

1. Create a Firebase project at [firebase.google.com](https://firebase.google.com)
2. Copy `.env.example` to `.env.local`
3. Add your Firebase configuration from the project settings
4. Enable Realtime Database in Firebase Console

Firebase Collections needed:
- `workTypes` - Store types of work offered
- `materials` - Materials with costs
- `labour` - Labour rates
- `quoteRequests` - Store customer quote requests
- `testimonials` - Store customer testimonials
- `promotions` - Store promotional offers
- `generatedQuotes` - Store generated quotes

### 3. Set Up Resend API (for emails)

1. Create account at [resend.com](https://resend.com)
2. Get your API key
3. Add to `.env.local`: `VITE_RESEND_API_KEY=your_key_here`

### 4. Configure Netlify

1. Create Netlify account
2. Connect GitHub repository
3. Set environment variables in Netlify settings
4. Deploy will auto-trigger on git push

### 5. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

### Build & Deploy

The project is configured for Netlify auto-deployment:
1. Push changes to GitHub
2. Netlify automatically builds and deploys
3. Netlify Functions handle backend API calls

## Customization

### Add Company Details

Edit `.env.local`:
```
VITE_COMPANY_NAME=Abacus Electrical Scotland
VITE_COMPANY_EMAIL=your@email.com
VITE_COMPANY_PHONE=+44 (0) XXXX
VITE_COMPANY_ADDRESS=Your Address
```

### Add Gallery Images

1. Add images to `public/images/` folder
2. Update Gallery.jsx to import and display images

### Modify Admin Password

1. Edit `.env.local`: `VITE_ADMIN_PASSWORD=your_secure_password`
2. Password will be checked on admin login

### Customize Color Scheme

Edit `src/styles/main.css` CSS variables:
```css
:root {
  --color-accent: #ff6b35; /* Change accent color */
  --color-text: #ffffff;   /* Already white */
  --color-bg: #000000;     /* Already black */
}
```

## Firebase Security Rules

Set up proper Firebase Realtime Database rules:

```json
{
  "rules": {
    "testimonials": {
      ".read": true,
      ".write": false,
      "$uid": {
        ".write": "root.child('adminToken').val() === auth.uid"
      }
    },
    "quoteRequests": {
      ".read": "root.child('adminToken').val() === auth.uid",
      ".write": true
    },
    "workTypes": {
      ".read": true,
      ".write": "root.child('adminToken').val() === auth.uid"
    }
  }
}
```

## Free Tier Limits

- **Netlify**: 125,000 functions invocations/month
- **Firebase DB**: 1GB storage, 100 concurrent connections
- **Resend**: 100 emails/day

These limits are suitable for a small business with moderate traffic.

## Future Enhancements

- Admin image gallery upload (Firebase Storage)
- Email notification system
- Customer testimonial verification with email link
- Payment processing for quotes
- Multi-language support
- Blog/news section
- FAQ management in admin panel
- Analytics integration

## Support

For issues or questions, please contact the development team.

## License

© 2024 Abacus Electrical Scotland. All rights reserved.
