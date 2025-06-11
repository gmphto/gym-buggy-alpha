import { createClient } from '@/lib/supabase/client'
import { Database } from '@/lib/supabase/database.types'
import { z } from 'zod'
import { CreateUserSchema, UpdateUserSchema, UserSchema } from './schemas'

type Profile = Database['public']['Tables']['profiles']['Row']
type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export class ProfileService {
  private supabase = createClient()

  // Pure function
  async getProfile(userId: string): Promise<z.infer<typeof UserSchema> | null> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Profile not found
      }
      throw new Error(error.message)
    }

    // Get gym data separately if gym_id exists
    let gymData = null
    if (data.gym_id) {
      const { data: gym, error: gymError } = await this.supabase
        .from('gyms')
        .select('id, name, address')
        .eq('id', data.gym_id)
        .single()

      if (!gymError) {
        gymData = gym
      }
    }

    // Transform database format to schema format
    return this.transformProfileToSchema(data, gymData)
  }

  // Pure function
  async getProfiles(gymId?: string): Promise<z.infer<typeof UserSchema>[]> {
    let query = this.supabase
      .from('profiles')
      .select('*')

    if (gymId) {
      query = query.eq('gym_id', gymId)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(error.message)
    }

    // Transform database format to schema format
    const profiles = await Promise.all(
      [...data].map(async (profile) => {
        let gymData = null
        if (profile.gym_id) {
          const { data: gym, error: gymError } = await this.supabase
            .from('gyms')
            .select('id, name, address')
            .eq('id', profile.gym_id)
            .single()

          if (!gymError) {
            gymData = gym
          }
        }
        return this.transformProfileToSchema(profile, gymData)
      })
    )

    return profiles
  }

  // Pure function
  async createProfile(profileData: z.infer<typeof CreateUserSchema>): Promise<z.infer<typeof UserSchema>> {
    const insertData: ProfileInsert = {
      id: profileData.id || '', // This should come from auth.uid()
      email: profileData.email,
      name: profileData.name,
      profile_image: profileData.profileImage || null,
      location: profileData.location || null,
      gym_id: profileData.gym?.id || null,
      preferences: profileData.preferences || null,
    }

    const { data, error } = await this.supabase
      .from('profiles')
      .insert(insertData)
      .select('*')
      .single()

    if (error) {
      throw new Error(error.message)
    }

    // Get gym data if gym_id exists
    let gymData = null
    if (data.gym_id) {
      const { data: gym, error: gymError } = await this.supabase
        .from('gyms')
        .select('id, name, address')
        .eq('id', data.gym_id)
        .single()

      if (!gymError) {
        gymData = gym
      }
    }

    return this.transformProfileToSchema(data, gymData)
  }

  // Pure function
  async updateProfile(userId: string, updates: z.infer<typeof UpdateUserSchema>): Promise<z.infer<typeof UserSchema>> {
    const updateData: ProfileUpdate = {
      name: updates.name,
      profile_image: updates.profileImage,
      location: updates.location,
      gym_id: updates.gym?.id,
      preferences: updates.preferences,
    }

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key as keyof ProfileUpdate] === undefined) {
        delete updateData[key as keyof ProfileUpdate]
      }
    })

    const { data, error } = await this.supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
      .select('*')
      .single()

    if (error) {
      throw new Error(error.message)
    }

    // Get gym data if gym_id exists
    let gymData = null
    if (data.gym_id) {
      const { data: gym, error: gymError } = await this.supabase
        .from('gyms')
        .select('id, name, address')
        .eq('id', data.gym_id)
        .single()

      if (!gymError) {
        gymData = gym
      }
    }

    return this.transformProfileToSchema(data, gymData)
  }

  // Pure function
  async searchProfiles(gymId: string, excludeUserId: string): Promise<z.infer<typeof UserSchema>[]> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('gym_id', gymId)
      .neq('id', excludeUserId)

    if (error) {
      throw new Error(error.message)
    }

    // Transform database format to schema format
    const profiles = await Promise.all(
      [...data].map(async (profile) => {
        let gymData = null
        if (profile.gym_id) {
          const { data: gym, error: gymError } = await this.supabase
            .from('gyms')
            .select('id, name, address')
            .eq('id', profile.gym_id)
            .single()

          if (!gymError) {
            gymData = gym
          }
        }
        return this.transformProfileToSchema(profile, gymData)
      })
    )

    return profiles
  }

  // Pure function
  private transformProfileToSchema(profile: Profile, gymData?: any): z.infer<typeof UserSchema> {
    return {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      profileImage: profile.profile_image || undefined,
      location: profile.location as { latitude: number; longitude: number; address?: string } || undefined,
      gym: gymData ? {
        id: gymData.id,
        name: gymData.name,
        address: gymData.address,
      } : undefined,
      preferences: (profile.preferences as { maxDistance: number; workoutTypes: string[]; availableHours: string[] }) || {
        maxDistance: 10,
        workoutTypes: [],
        availableHours: [],
      },
      createdAt: new Date(profile.created_at),
      updatedAt: new Date(profile.updated_at),
    }
  }
}

// Export singleton instance
export const profileService = new ProfileService() 