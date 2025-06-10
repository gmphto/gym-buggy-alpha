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
      .select(`
        *,
        gym:gyms(*)
      `)
      .eq('id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Profile not found
      }
      throw new Error(error.message)
    }

    // Transform database format to schema format
    return this.transformProfileToSchema(data)
  }

  // Pure function
  async getProfiles(gymId?: string): Promise<z.infer<typeof UserSchema>[]> {
    let query = this.supabase
      .from('profiles')
      .select(`
        *,
        gym:gyms(*)
      `)

    if (gymId) {
      query = query.eq('gym_id', gymId)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(error.message)
    }

    // Transform database format to schema format
    return [...data].map(profile => this.transformProfileToSchema(profile))
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
      .select(`
        *,
        gym:gyms(*)
      `)
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return this.transformProfileToSchema(data)
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
      .select(`
        *,
        gym:gyms(*)
      `)
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return this.transformProfileToSchema(data)
  }

  // Pure function
  async searchProfiles(gymId: string, excludeUserId: string): Promise<z.infer<typeof UserSchema>[]> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select(`
        *,
        gym:gyms(*)
      `)
      .eq('gym_id', gymId)
      .neq('id', excludeUserId)

    if (error) {
      throw new Error(error.message)
    }

    return [...data].map(profile => this.transformProfileToSchema(profile))
  }

  // Pure function
  private transformProfileToSchema(profile: any): z.infer<typeof UserSchema> {
    return {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      profileImage: profile.profile_image,
      location: profile.location,
      gym: profile.gym ? {
        id: profile.gym.id,
        name: profile.gym.name,
        address: profile.gym.address,
      } : undefined,
      preferences: profile.preferences || {
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