# Supabase Setup for Gym Buddy

This guide will help you set up Supabase for the Gym Buddy application.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create an account
2. Click "New project"
3. Choose your organization
4. Enter project details:
   - **Name**: gym-buddy
   - **Database Password**: Choose a strong password
   - **Region**: Select the closest region to your users
5. Click "Create new project"

## 2. Get Your Project Credentials

Once your project is created:

1. Go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (under "Project URL")
   - **Anon/Public Key** (under "Project API keys")
   - **Service Role Key** (under "Project API keys") - Keep this secret!

## 3. Configure Environment Variables

Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

Replace the placeholder values with your actual Supabase credentials.

## 4. Run the Database Migration

1. Go to **SQL Editor** in your Supabase dashboard
2. Copy the contents of `supabase/migrations/20241209_initial_schema.sql`
3. Paste it into the SQL Editor
4. Click "Run" to execute the migration

This will create:

- User profiles table
- Gyms table with sample data
- Matches table
- Row Level Security policies
- Necessary triggers and functions

## 5. Configure Authentication

1. Go to **Authentication** → **Settings**
2. Under **Site URL**, add your development URL: `http://localhost:3000`
3. Under **Redirect URLs**, add: `http://localhost:3000/auth/callback`
4. Enable email confirmations if desired (optional for development)

## 6. Test the Setup

1. Start your development server: `npm run dev`
2. Visit `http://localhost:3000`
3. Try registering a new account
4. Check if the user appears in the **Authentication** → **Users** section
5. Verify the profile was created in the **Table Editor** → **profiles**

## 7. Sample Data

The migration includes 5 sample gyms in the New York area. You can:

- View them in **Table Editor** → **gyms**
- Add more gyms through the dashboard
- Test the gym selection feature

## 8. Production Setup

For production deployment:

1. Update environment variables with production Supabase URLs
2. Add your production domain to **Authentication** → **Settings**
3. Configure proper redirect URLs
4. Review and adjust Row Level Security policies if needed

## Troubleshooting

### Common Issues:

1. **"Invalid JWT" errors**: Check that your environment variables are correct
2. **CORS errors**: Ensure your domain is added to the allowed origins
3. **Profile not created**: Check the `handle_new_user()` trigger function
4. **RLS errors**: Verify Row Level Security policies are properly configured

### Getting Help:

- Check the [Supabase Documentation](https://supabase.com/docs)
- Join the [Supabase Discord](https://discord.supabase.com)
- Review the Gym Buddy code for implementation examples

## Architecture Overview

The Supabase integration includes:

- **Authentication**: Email/password with automatic profile creation
- **Database**: PostgreSQL with RLS for security
- **Real-time**: Subscription capabilities for live updates
- **API**: Auto-generated REST and GraphQL APIs
- **Storage**: Ready for profile images and gym photos (optional)

Your gym buddy app is now fully supabasified! 🚀
