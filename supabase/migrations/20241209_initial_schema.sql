-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    profile_image TEXT,
    location JSONB,
    gym_id UUID,
    preferences JSONB DEFAULT '{"maxDistance": 10, "workoutTypes": [], "availableHours": []}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create gyms table
CREATE TABLE IF NOT EXISTS public.gyms (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    location JSONB NOT NULL, -- {latitude: number, longitude: number}
    amenities TEXT[] DEFAULT '{}',
    hours JSONB DEFAULT '{}', -- {monday: string, tuesday: string, ...}
    images TEXT[] DEFAULT '{}',
    rating NUMERIC(2,1) CHECK (rating >= 0 AND rating <= 5),
    price_range TEXT CHECK (price_range IN ('$', '$$', '$$$')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create matches table
CREATE TABLE IF NOT EXISTS public.matches (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    partner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    gym_id UUID REFERENCES public.gyms(id) ON DELETE CASCADE NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'completed')),
    scheduled_at TIMESTAMP WITH TIME ZONE,
    workout_type TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Ensure users can't match with themselves
    CHECK (user_id != partner_id),
    
    -- Ensure unique match requests between users for the same gym
    UNIQUE(user_id, partner_id, gym_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS profiles_gym_id_idx ON public.profiles(gym_id);
CREATE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles(email);
CREATE INDEX IF NOT EXISTS matches_user_id_idx ON public.matches(user_id);
CREATE INDEX IF NOT EXISTS matches_partner_id_idx ON public.matches(partner_id);
CREATE INDEX IF NOT EXISTS matches_gym_id_idx ON public.matches(gym_id);
CREATE INDEX IF NOT EXISTS matches_status_idx ON public.matches(status);
CREATE INDEX IF NOT EXISTS gyms_location_idx ON public.gyms USING GIN(location);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_gyms_updated_at
    BEFORE UPDATE ON public.gyms
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_matches_updated_at
    BEFORE UPDATE ON public.matches
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Add foreign key constraint for gym_id in profiles
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_gym_id_fkey 
FOREIGN KEY (gym_id) REFERENCES public.gyms(id) ON DELETE SET NULL;

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gyms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Gyms policies (public read access)
CREATE POLICY "Anyone can view gyms" ON public.gyms
    FOR SELECT USING (true);

-- Matches policies
CREATE POLICY "Users can view their own matches" ON public.matches
    FOR SELECT USING (auth.uid() = user_id OR auth.uid() = partner_id);

CREATE POLICY "Users can create matches" ON public.matches
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update matches they're involved in" ON public.matches
    FOR UPDATE USING (auth.uid() = user_id OR auth.uid() = partner_id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name)
    VALUES (
        new.id, 
        new.email, 
        COALESCE(
            new.raw_user_meta_data->>'name',
            new.raw_user_meta_data->>'full_name',
            split_part(new.email, '@', 1)
        )
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert some sample gyms for testing
INSERT INTO public.gyms (name, address, location, amenities, rating, price_range) VALUES
('FitLife Gym', '123 Main St, Downtown', '{"latitude": 40.7128, "longitude": -74.0060}', ARRAY['Weights', 'Cardio', 'Pool'], 4.5, '$$'),
('PowerHouse Fitness', '456 Oak Ave, Midtown', '{"latitude": 40.7589, "longitude": -73.9851}', ARRAY['Weights', 'CrossFit', 'Sauna'], 4.2, '$$$'),
('Community Wellness Center', '789 Pine St, Uptown', '{"latitude": 40.7831, "longitude": -73.9712}', ARRAY['Cardio', 'Yoga', 'Pool', 'Basketball'], 4.0, '$'),
('Elite Training Club', '321 Broadway, Central', '{"latitude": 40.7505, "longitude": -73.9934}', ARRAY['Weights', 'Personal Training', 'Spa'], 4.8, '$$$'),
('Neighborhood Gym', '654 Second Ave, East Side', '{"latitude": 40.7282, "longitude": -73.9942}', ARRAY['Weights', 'Cardio'], 3.8, '$'); 