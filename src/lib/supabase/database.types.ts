export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          profile_image: string | null
          location: Json | null
          gym_id: string | null
          preferences: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          profile_image?: string | null
          location?: Json | null
          gym_id?: string | null
          preferences?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          profile_image?: string | null
          location?: Json | null
          gym_id?: string | null
          preferences?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      gyms: {
        Row: {
          id: string
          name: string
          address: string
          location: Json
          amenities: string[]
          hours: Json | null
          images: string[]
          rating: number | null
          price_range: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          address: string
          location: Json
          amenities?: string[]
          hours?: Json | null
          images?: string[]
          rating?: number | null
          price_range?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string
          location?: Json
          amenities?: string[]
          hours?: Json | null
          images?: string[]
          rating?: number | null
          price_range?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      matches: {
        Row: {
          id: string
          user_id: string
          partner_id: string
          gym_id: string
          status: 'pending' | 'accepted' | 'declined' | 'completed'
          scheduled_at: string | null
          workout_type: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          partner_id: string
          gym_id: string
          status?: 'pending' | 'accepted' | 'declined' | 'completed'
          scheduled_at?: string | null
          workout_type?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          partner_id?: string
          gym_id?: string
          status?: 'pending' | 'accepted' | 'declined' | 'completed'
          scheduled_at?: string | null
          workout_type?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 