# Local Development Setup for Vilala

## Quick Start (Without Google OAuth)

For immediate testing without setting up Google OAuth:

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   - Main site: http://localhost:3000
   - Admin area: http://localhost:3000/admin (will redirect to login)

## With Google OAuth (Recommended)

### Step 1: Set up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API:
   - APIs & Services → Library
   - Search "Google+ API" and enable
4. Create OAuth 2.0 credentials:
   - APIs & Services → Credentials
   - Create Credentials → OAuth 2.0 Client ID
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
5. Copy Client ID and Client Secret

### Step 2: Update Environment Variables

Edit `.env` file:
```env
GOOGLE_CLIENT_ID="your-actual-google-client-id"
GOOGLE_CLIENT_SECRET="your-actual-google-client-secret"
```

### Step 3: Run the Application

```bash
npm run dev
```

## Features Available

✅ **Working Features:**
- Homepage with hero section and featured cabins
- Cabin listing page with filters
- Individual cabin pages
- Blog system with articles
- Database with seeded data (SQLite)
- Authentication system (NextAuth.js)
- Admin dashboard UI
- Responsive design

⚠️ **Requires OAuth Setup:**
- Admin login functionality
- Admin CRUD operations
- User session management

## Database

The application uses SQLite with pre-seeded data:
- 4 cabin owners
- 4 cabins with details
- 4 rooms with pricing
- 7 blog posts
- App settings

## File Structure

```
src/
├── app/                 # Next.js app router pages
├── components/          # Reusable components
├── lib/                 # Utilities and configurations
└── types/              # TypeScript type definitions
```

## Troubleshooting

If you encounter issues:

1. **Port 3000 in use:** Kill existing processes or use different port
2. **Database issues:** Delete `dev.db` and run `npm run db:reset`
3. **Build errors:** Run `npm run lint` to check for issues
4. **Authentication issues:** Verify Google OAuth credentials

## Next Steps

After local setup works:
1. Implement cabin CRUD operations
2. Add blog post management
3. Enhance API endpoints
4. Add image upload functionality