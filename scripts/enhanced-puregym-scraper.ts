import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { z } from 'zod'
import { getDefaultPureGymAmenities, getFallbackPureGymLocations } from './puregym-data'

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' })

// Pure function - Enhanced schema for gym data from multiple sources
const EnhancedGymLocationSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  latitude: z.number(),
  longitude: z.number(),
  phone: z.string().optional(),
  website: z.string().url().optional(),
  hours: z.object({
    monday: z.string().optional(),
    tuesday: z.string().optional(),
    wednesday: z.string().optional(),
    thursday: z.string().optional(),
    friday: z.string().optional(),
    saturday: z.string().optional(),
    sunday: z.string().optional(),
  }).optional(),
  amenities: z.array(z.string()).default([]),
  priceRange: z.enum(['$', '$$', '$$$']).default('$'),
  source: z.string(),
})

type EnhancedGymLocation = z.infer<typeof EnhancedGymLocationSchema>

class EnhancedPureGymScraper {
  private supabase: ReturnType<typeof createClient>

  constructor() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
    }

    this.supabase = createClient(supabaseUrl, supabaseServiceKey)
  }

  // Pure function - Find PureGyms using Google Places API
  async findPureGymsWithGooglePlaces(): Promise<EnhancedGymLocation[]> {
    const locations: EnhancedGymLocation[] = []
    
    try {
      // Note: This requires a Google Places API key
      const apiKey = process.env.GOOGLE_PLACES_API_KEY
      if (!apiKey) {
        console.warn('⚠️ Google Places API key not found, skipping Google Places search')
        return []
      }

      console.log('🔍 Searching for PureGyms using Google Places API...')

      // Search in major UK cities
      const ukCities = [
        { name: 'London', lat: 51.5074, lng: -0.1278 },
        { name: 'Manchester', lat: 53.4808, lng: -2.2426 },
        { name: 'Birmingham', lat: 52.4862, lng: -1.8904 },
        { name: 'Leeds', lat: 53.8008, lng: -1.5491 },
        { name: 'Glasgow', lat: 55.8642, lng: -4.2518 },
        { name: 'Edinburgh', lat: 55.9533, lng: -3.1883 },
        { name: 'Liverpool', lat: 53.4084, lng: -2.9916 },
        { name: 'Bristol', lat: 51.4545, lng: -2.5879 },
        { name: 'Newcastle', lat: 54.9783, lng: -1.6178 },
        { name: 'Sheffield', lat: 53.3811, lng: -1.4701 },
        { name: 'Cardiff', lat: 51.4816, lng: -3.1791 },
        { name: 'Belfast', lat: 54.5973, lng: -5.9301 }
      ]

      for (const city of ukCities) {
        try {
          const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${city.lat},${city.lng}&radius=50000&keyword=PureGym&type=gym&key=${apiKey}`
          
          const response = await fetch(url)
          const data = await response.json()

          if (data.results) {
            for (const place of data.results) {
              if (place.name.toLowerCase().includes('puregym')) {
                try {
                  const gymLocation: EnhancedGymLocation = {
                    name: place.name,
                    address: place.vicinity || place.formatted_address || 'Address not available',
                    latitude: place.geometry.location.lat,
                    longitude: place.geometry.location.lng,
                    phone: place.formatted_phone_number,
                    website: place.website,
                    amenities: getDefaultPureGymAmenities(),
                    priceRange: '$',
                    source: 'Google Places API'
                  }

                  const validated = EnhancedGymLocationSchema.parse(gymLocation)
                  locations.push(validated)
                } catch (error) {
                  console.warn(`⚠️ Skipping invalid gym from Google Places:`, place.name)
                }
              }
            }
          }

          // Respectful delay between API calls
          await new Promise(resolve => setTimeout(resolve, 200))
        } catch (error) {
          console.warn(`⚠️ Error searching ${city.name}:`, error)
        }
      }

      console.log(`✅ Found ${locations.length} PureGyms via Google Places API`)
    } catch (error) {
      console.error('❌ Error with Google Places API:', error)
    }

    return locations
  }

  // Pure function - Find PureGyms using Overpass API (OpenStreetMap)
  async findPureGymsWithOverpass(): Promise<EnhancedGymLocation[]> {
    const locations: EnhancedGymLocation[] = []
    
    try {
      console.log('🗺️ Searching for PureGyms using OpenStreetMap/Overpass API...')

      // Overpass API query to find PureGyms in the UK
      const query = `
        [out:json][timeout:25];
        (
          node["amenity"="gym"]["name"~"PureGym|Pure Gym"]["addr:country"="GB"];
          way["amenity"="gym"]["name"~"PureGym|Pure Gym"]["addr:country"="GB"];
          relation["amenity"="gym"]["name"~"PureGym|Pure Gym"]["addr:country"="GB"];
        );
        out geom;
      `

      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `data=${encodeURIComponent(query)}`
      })

      if (!response.ok) {
        throw new Error(`Overpass API error: ${response.status}`)
      }

      const data = await response.json()

      for (const element of data.elements) {
        try {
          let lat: number, lng: number
          
          if (element.type === 'node') {
            lat = element.lat
            lng = element.lon
          } else if (element.type === 'way' && element.center) {
            lat = element.center.lat
            lng = element.center.lon
          } else {
            continue
          }

          const address = [
            element.tags['addr:housenumber'],
            element.tags['addr:street'],
            element.tags['addr:city'],
            element.tags['addr:postcode']
          ].filter(Boolean).join(', ') || 'Address not available'

          const gymLocation: EnhancedGymLocation = {
            name: element.tags.name || 'PureGym',
            address,
            latitude: lat,
            longitude: lng,
            phone: element.tags.phone,
            website: element.tags.website,
            amenities: getDefaultPureGymAmenities(),
            priceRange: '$',
            source: 'OpenStreetMap'
          }

          const validated = EnhancedGymLocationSchema.parse(gymLocation)
          locations.push(validated)
        } catch (error) {
          console.warn(`⚠️ Skipping invalid gym from OSM:`, element.tags?.name)
        }
      }

      console.log(`✅ Found ${locations.length} PureGyms via OpenStreetMap`)
    } catch (error) {
      console.error('❌ Error with Overpass API:', error)
    }

    return locations
  }

  // Pure function - Enhanced fetch using multiple data sources
  async fetchAllPureGyms(): Promise<EnhancedGymLocation[]> {
    console.log('🚀 Starting enhanced PureGym search using multiple data sources...')
    
    const allLocations: EnhancedGymLocation[] = []

    // Method 1: Google Places API
    const googlePlaces = await this.findPureGymsWithGooglePlaces()
    allLocations.push(...googlePlaces)

    // Method 2: OpenStreetMap/Overpass API
    const osmLocations = await this.findPureGymsWithOverpass()
    allLocations.push(...osmLocations)

    // Method 3: Fallback data
    console.log('📊 Adding fallback PureGym location data...')
    const fallbackData = getFallbackPureGymLocations()
    const fallbackLocations = fallbackData.map(gym => ({
      name: gym.name,
      address: gym.address,
      latitude: gym.latitude,
      longitude: gym.longitude,
      amenities: gym.amenities,
      priceRange: '$' as const,
      source: 'Fallback Data'
    }))
    allLocations.push(...fallbackLocations)

    // Remove duplicates based on name and approximate location
    const uniqueLocations = this.removeDuplicateGyms(allLocations)
    
    console.log(`✅ Total unique PureGym locations found: ${uniqueLocations.length}`)
    return uniqueLocations
  }

  // Pure function - Remove duplicate gyms based on name and location
  private removeDuplicateGyms(gyms: EnhancedGymLocation[]): EnhancedGymLocation[] {
    const uniqueGyms: EnhancedGymLocation[] = []
    const seen = new Set<string>()

    for (const gym of gyms) {
      // Create a unique key based on name and approximate location
      const locationKey = `${gym.name.toLowerCase().replace(/\s+/g, '')}_${Math.round(gym.latitude * 1000)}_${Math.round(gym.longitude * 1000)}`
      
      if (!seen.has(locationKey)) {
        seen.add(locationKey)
        uniqueGyms.push(gym)
      }
    }

    return uniqueGyms
  }

  // Pure function - Store enhanced gym data in database
  async storeEnhancedGymsInDatabase(gyms: EnhancedGymLocation[]): Promise<void> {
    console.log(`💾 Storing ${gyms.length} enhanced gym records in database...`)
    
    const batch = gyms.map(gym => ({
      name: gym.name,
      address: gym.address,
      location: { latitude: gym.latitude, longitude: gym.longitude },
      amenities: gym.amenities,
      hours: gym.hours || {},
      images: [], // Could be enhanced later with image scraping
      rating: null,
      price_range: gym.priceRange,
    }))

    try {
      // Clear existing PureGym data first (optional)
      const { error: deleteError } = await this.supabase
        .from('gyms')
        .delete()
        .ilike('name', '%PureGym%')

      if (deleteError) {
        console.warn('⚠️ Could not clear existing PureGym data:', deleteError)
      }

      // Insert new data in batches
      const batchSize = 25
      let inserted = 0
      
      for (let i = 0; i < batch.length; i += batchSize) {
        const batchData = batch.slice(i, i + batchSize)
        
        const { data, error } = await this.supabase
          .from('gyms')
          .insert(batchData)

        if (error) {
          console.error('❌ Database error:', error)
          throw error
        }

        inserted += batchData.length
        console.log(`✅ Inserted ${inserted}/${batch.length} gyms`)
      }

      console.log('🎉 Successfully stored all enhanced PureGym locations!')
    } catch (error) {
      console.error('❌ Error storing enhanced gyms in database:', error)
      throw error
    }
  }

  // Pure function - Main execution method
  async run(): Promise<void> {
    try {
      console.log('🚀 Starting Enhanced PureGym Scraper...')
      console.log('📍 This will search multiple data sources for comprehensive gym data')
      
      const locations = await this.fetchAllPureGyms()
      
      if (locations.length === 0) {
        console.log('❌ No PureGym locations found from any source')
        return
      }

      console.log(`📊 Found ${locations.length} total PureGym locations`)
      
      // Show breakdown by source
      const sourceBreakdown = locations.reduce((acc, gym) => {
        acc[gym.source] = (acc[gym.source] || 0) + 1
        return acc
      }, {} as Record<string, number>)
      
      console.log('📈 Breakdown by source:')
      Object.entries(sourceBreakdown).forEach(([source, count]) => {
        console.log(`   - ${source}: ${count} locations`)
      })
      
      await this.storeEnhancedGymsInDatabase(locations)
      
      console.log('✅ Enhanced PureGym scraper completed successfully!')
    } catch (error) {
      console.error('❌ Enhanced PureGym scraper failed:', error)
      process.exit(1)
    }
  }
}

// Script execution
async function main() {
  const scraper = new EnhancedPureGymScraper()
  await scraper.run()
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error)
}

export { EnhancedGymLocationSchema, EnhancedPureGymScraper }
