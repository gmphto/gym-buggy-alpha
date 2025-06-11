# Google OAuth Setup for Gym Buddy

## 1. Create Google OAuth Credentials

### Step 1: Go to Google Cloud Console

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Name it "Gym Buddy" or similar

### Step 2: Enable Google+ API

1. Go to **APIs & Services** → **Library**
2. Search for "Google+ API"
3. Click **Enable**

### Step 3: Configure OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth consent screen**
2. Choose **External** for user type
3. Fill out the form:
   - **App name**: Gym Buddy
   - **User support email**: Your email
   - **App logo**: Optional
   - **App domain**: `http://localhost:3000` (for development)
   - **Developer contact**: Your email
4. Click **Save and Continue**
5. Skip **Scopes** (click **Save and Continue**)
6. Add test users (your email) for development
7. Click **Save and Continue**

### Step 4: Create OAuth 2.0 Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **+ Create Credentials** → **OAuth 2.0 Client IDs**
3. Choose **Web application**
4. Name it "Gym Buddy Web Client"
5. Add **Authorized redirect URIs**:
   - Development: `http://localhost:3000/auth/callback`
   - Production: `https://yourdomain.com/auth/callback`
6. Click **Create**
7. **Copy the Client ID and Client Secret** (you'll need these)

## 2. Configure Supabase

### Step 1: Enable Google Provider

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Providers**
3. Find **Google** and click **Enable**

### Step 2: Add Google Credentials

1. Paste your **Google Client ID**
2. Paste your **Google Client Secret**
3. Click **Save**

### Step 3: Configure Redirect URLs

1. In **Authentication** → **Settings**
2. Under **Site URL**, add: `http://localhost:3000`
3. Under **Redirect URLs**, add: `http://localhost:3000/auth/callback`

## 3. Test the Integration

1. **Start your development server**: `npm run dev`
2. **Visit** `http://localhost:3000`
3. **Click "Continue with Google"**
4. **Sign in with your Google account**
5. **Check Supabase dashboard** → **Authentication** → **Users**

## 4. Production Setup

### For Production Deployment:

1. **Update Google Cloud Console**:

   - Add production domain to OAuth consent screen
   - Add production redirect URI: `https://yourdomain.com/auth/callback`

2. **Update Supabase**:

   - Add production URL to Site URL
   - Add production callback URL to Redirect URLs

3. **Environment Variables**:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
   ```

## 5. Features Now Available

✅ **One-click Google sign-in**  
✅ **Automatic profile creation**  
✅ **Seamless user experience**  
✅ **No password required**  
✅ **Secure OAuth flow**  
✅ **Production ready**

## 6. Troubleshooting

### Common Issues:

1. **"redirect_uri_mismatch"**:

   - Check your redirect URIs in Google Cloud Console
   - Must exactly match: `http://localhost:3000/auth/callback`

2. **"Access blocked"**:

   - App needs verification for production
   - Add test users in OAuth consent screen for development

3. **"Invalid client"**:

   - Check Client ID and Secret in Supabase
   - Ensure Google+ API is enabled

4. **Profile not created**:
   - Check the `handle_new_user()` function in database
   - Verify the database migration was run

### Getting Help:

- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Next.js OAuth Guide](https://nextjs.org/docs/authentication)

Your users can now sign in with Google in just one click! 🚀
