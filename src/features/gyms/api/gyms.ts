import { createClient } from '@/lib/supabase/client'
import { Database } from '@/lib/supabase/database.types'
import { z } from 'zod'
import { GymSchema, GymSearchSchema } from './schemas'

type Gym = Database['public']['Tables']['gyms']['Row']
type GymInsert = Database['public']['Tables']['gyms']['Insert']

export class GymService {
  private supabase = createClient()

  // Pure function
  async getGym(gymId: string): Promise<z.infer<typeof GymSchema> | null> {
    const { data, error } = await this.supabase
      .from('gyms')
      .select('*')
      .eq('id', gymId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Gym not found
      }
      throw new Error(error.message)
    }

    return this.transformGymToSchema(data)
  }

  // Pure function
  async getGyms(): Promise<z.infer<typeof GymSchema>[]> {
    const { data, error } = await this.supabase
      .from('gyms')
      .select('*')
      .order('name')

    if (error) {
      throw new Error(error.message)
    }

    return [...data].map(gym => this.transformGymToSchema(gym))
  }

  // Pure function
  async searchGyms(searchParams: z.infer<typeof GymSearchSchema>): Promise<z.infer<typeof GymSchema>[]> {
    let query = this.supabase
      .from('gyms')
      .select('*')

    // Add text search if query provided
    if (searchParams.query) {
      query = query.or(`name.ilike.%${searchParams.query}%,address.ilike.%${searchParams.query}%`)
    }

    // Add price range filter
    if (searchParams.priceRange && searchParams.priceRange.length > 0) {
      query = query.in('price_range', searchParams.priceRange)
    }

    const { data, error } = await query.order('name')

    if (error) {
      throw new Error(error.message)
    }

    let gyms = [...data].map(gym => this.transformGymToSchema(gym))

    // Filter by location/radius if provided
    if (searchParams.latitude && searchParams.longitude && searchParams.radius) {
      gyms = gyms.filter(gym => {
        if (!gym.location) return false
        
        const distance = this.calculateDistance(
          searchParams.latitude!,
          searchParams.longitude!,
          gym.location.latitude,
          gym.location.longitude
        )
        
        return distance <= searchParams.radius!
      })
    }

    // Filter by amenities
    if (searchParams.amenities && searchParams.amenities.length > 0) {
      gyms = gyms.filter(gym => 
        searchParams.amenities!.some(amenity => 
          gym.amenities.includes(amenity)
        )
      )
    }

    return gyms
  }

  // Pure function
  async getNearbyGyms(latitude: number, longitude: number, radiusKm: number = 10): Promise<z.infer<typeof GymSchema>[]> {
    const { data, error } = await this.supabase
      .from('gyms')
      .select('*')

    if (error) {
      throw new Error(error.message)
    }

    const gyms = [...data].map(gym => this.transformGymToSchema(gym))

    // Filter by distance
    return gyms.filter(gym => {
      if (!gym.location) return false
      
      const distance = this.calculateDistance(
        latitude,
        longitude,
        gym.location.latitude,
        gym.location.longitude
      )
      
      return distance <= radiusKm
    }).sort((a, b) => {
      // Sort by distance
      const distA = this.calculateDistance(latitude, longitude, a.location!.latitude, a.location!.longitude)
      const distB = this.calculateDistance(latitude, longitude, b.location!.latitude, b.location!.longitude)
      return distA - distB
    })
  }

  // Pure function
  private transformGymToSchema(gym: Gym): z.infer<typeof GymSchema> {
    return {
      id: gym.id,
      name: gym.name,
      address: gym.address,
      location: gym.location as { latitude: number; longitude: number },
      amenities: gym.amenities || [],
      hours: gym.hours as any || {},
      images: gym.images || [],
      rating: gym.rating || undefined,
      priceRange: gym.price_range as any || undefined,
      createdAt: new Date(gym.created_at),
      updatedAt: new Date(gym.updated_at),
    }
  }

  // Pure function - Calculate distance between two coordinates using Haversine formula
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371 // Radius of the Earth in kilometers
    const dLat = this.deg2rad(lat2 - lat1)
    const dLon = this.deg2rad(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const d = R * c // Distance in km
    return d
  }

  // Pure function
  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180)
  }
}

// Export singleton instance
export const gymService = new GymService() 