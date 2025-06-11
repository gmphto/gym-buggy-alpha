import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { z } from 'zod'
import { getFallbackPureGymLocations } from './puregym-data'

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' })

// Pure function - Zod schema for PureGym data validation
const PureGymLocationSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  latitude: z.number(),
  longitude: z.number(),
  url: z.string().url(),
  phone: z.string().optional(),
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
})

type PureGymLocation = z.infer<typeof PureGymLocationSchema>

// Pure function - Transform raw PureGym data to schema format
function transformPureGymData(rawData: any): z.infer<typeof PureGymLocationSchema> {
  return {
    name: rawData.name,
    address: rawData.address,
    latitude: parseFloat(rawData.latitude),
    longitude: parseFloat(rawData.longitude),
    url: rawData.url,
    phone: rawData.phone,
    hours: rawData.hours || {},
    amenities: rawData.amenities || [
      'Weights',
      'Cardio',
      'Functional Training',
      'Free Wi-Fi',
      '24/7 Access',
      'CCTV',
      'Air Conditioning'
    ],
    priceRange: '$' as const, // PureGym is budget-friendly
  }
}

class PureGymScraper {
  private supabase: ReturnType<typeof createClient>

  constructor() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables')
    }

    this.supabase = createClient(supabaseUrl, supabaseServiceKey)
  }

  // Pure function - Fetch PureGym locations from their API/website
  async fetchPureGymLocations(): Promise<PureGymLocation[]> {
    try {
      console.log('🔍 Searching for PureGym locations...')
      
      // Method 1: Try to fetch from PureGym's gym finder API
      let locations = await this.fetchFromGymFinder()
      
      if (locations.length > 0) {
        console.log(`✅ Found ${locations.length} PureGym locations via API`)
        return locations
      }

      // Method 2: Fallback to scraping gym pages
      console.log('📄 Falling back to scraping gym pages...')
      locations = await this.scrapeGymPages()
      
      if (locations.length > 0) {
        console.log(`✅ Found ${locations.length} PureGym locations via scraping`)
        return locations
      }

      // Method 3: Use fallback data
      console.log('📊 Using fallback PureGym location data...')
      const fallbackData = getFallbackPureGymLocations()
      locations = fallbackData.map(gym => ({
        name: gym.name,
        address: gym.address,
        latitude: gym.latitude,
        longitude: gym.longitude,
        url: `https://www.puregym.com/gyms/${gym.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`,
        amenities: gym.amenities,
        priceRange: '$' as const,
      }))
      
      console.log(`✅ Using ${locations.length} fallback PureGym locations`)
      return locations
      
    } catch (error) {
      console.error('❌ Error fetching PureGym locations:', error)
      
      // Even if there's an error, try to use fallback data
      console.log('🔄 Attempting to use fallback data due to error...')
      const fallbackData = getFallbackPureGymLocations()
      const locations = fallbackData.map(gym => ({
        name: gym.name,
        address: gym.address,
        latitude: gym.latitude,
        longitude: gym.longitude,
        url: `https://www.puregym.com/gyms/${gym.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`,
        amenities: gym.amenities,
        priceRange: '$' as const,
      }))
      
      console.log(`✅ Using ${locations.length} fallback locations as emergency data`)
      return locations
    }
  }

  // Pure function - Attempt to fetch from PureGym's gym finder
  private async fetchFromGymFinder(): Promise<PureGymLocation[]> {
    const locations: PureGymLocation[] = []
    
    try {
      // PureGym's gym finder endpoint (this may change)
      const response = await fetch('https://www.puregym.com/api/gyms/all', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'application/json',
          'Referer': 'https://www.puregym.com/gyms/',
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (Array.isArray(data)) {
        for (const gym of data) {
          try {
            const transformedGym = transformPureGymData(gym)
            const validatedGym = PureGymLocationSchema.parse(transformedGym)
            locations.push(validatedGym)
          } catch (error) {
            console.warn(`⚠️ Skipping invalid gym data:`, gym.name, error)
          }
        }
      }
    } catch (error) {
      console.warn('⚠️ API method failed, will try scraping:', error)
    }

    return locations
  }

  // Pure function - Scrape gym pages for location data
  private async scrapeGymPages(): Promise<PureGymLocation[]> {
    const locations: PureGymLocation[] = []
    
    try {
      // First, get the list of all gym URLs from the main gyms page
      const gymUrls = await this.getGymUrls()
      console.log(`📍 Found ${gymUrls.length} gym URLs to process`)

      // Process gyms in batches to avoid overwhelming the server
      const batchSize = 5
      for (let i = 0; i < gymUrls.length; i += batchSize) {
        const batch = gymUrls.slice(i, i + batchSize)
        const batchPromises = batch.map(url => this.scrapeGymDetails(url))
        
        try {
          const batchResults = await Promise.allSettled(batchPromises)
          
          for (const result of batchResults) {
            if (result.status === 'fulfilled' && result.value) {
              locations.push(result.value)
            }
          }
          
          console.log(`✅ Processed batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(gymUrls.length/batchSize)}`)
          
          // Respectful delay between batches
          if (i + batchSize < gymUrls.length) {
            await new Promise(resolve => setTimeout(resolve, 2000))
          }
        } catch (error) {
          console.warn(`⚠️ Batch ${Math.floor(i/batchSize) + 1} failed:`, error)
        }
      }
    } catch (error) {
      console.error('❌ Error in scrapeGymPages:', error)
    }

    return locations
  }

  // Pure function - Get all gym URLs from PureGym's gym listing
  private async getGymUrls(): Promise<string[]> {
    const urls: string[] = []
    
    try {
      const response = await fetch('https://www.puregym.com/gyms/', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const html = await response.text()
      
      // Extract gym URLs from the HTML (this regex pattern may need adjustment)
      const gymUrlRegex = /href="\/gyms\/([^"]+)"/g
      let match
      
      while ((match = gymUrlRegex.exec(html)) !== null) {
        const gymSlug = match[1]
        if (gymSlug && !gymSlug.includes('?') && gymSlug !== 'find-a-gym') {
          urls.push(`https://www.puregym.com/gyms/${gymSlug}`)
        }
      }
      
      // Remove duplicates
      return Array.from(new Set(urls))
    } catch (error) {
      console.error('❌ Error getting gym URLs:', error)
      return []
    }
  }

  // Pure function - Scrape individual gym page for details
  private async scrapeGymDetails(url: string): Promise<PureGymLocation | null> {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        }
      })

      if (!response.ok) {
        return null
      }

      const html = await response.text()
      
      // Extract gym data from HTML (you may need to adjust these based on PureGym's current HTML structure)
      const nameMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/)
      const addressMatch = html.match(/address[^>]*>([^<]+)</i)
      
      // Look for coordinates in script tags or data attributes
      const latMatch = html.match(/latitude["\s]*:[\s]*["']?([0-9.-]+)["']?/i)
      const lngMatch = html.match(/longitude["\s]*:[\s]*["']?([0-9.-]+)["']?/i)
      
      // Alternative coordinate extraction methods
      const coordMatch = html.match(/data-lat=["']([0-9.-]+)["'][^>]*data-lng=["']([0-9.-]+)["']/i)
      
      if (!nameMatch || !addressMatch) {
        console.warn(`⚠️ Could not extract basic data from ${url}`)
        return null
      }

      let latitude: number, longitude: number

      if (latMatch && lngMatch) {
        latitude = parseFloat(latMatch[1])
        longitude = parseFloat(lngMatch[1])
      } else if (coordMatch) {
        latitude = parseFloat(coordMatch[1])
        longitude = parseFloat(coordMatch[2])
      } else {
        // Fallback: try to geocode the address
        const geocoded = await this.geocodeAddress(addressMatch[1])
        if (!geocoded) {
          console.warn(`⚠️ Could not get coordinates for ${nameMatch[1]}`)
          return null
        }
        latitude = geocoded.lat
        longitude = geocoded.lng
      }

      const gymData = {
        name: nameMatch[1].trim(),
        address: addressMatch[1].trim(),
        latitude,
        longitude,
        url,
        amenities: [
          'Weights',
          'Cardio',
          'Functional Training',
          'Free Wi-Fi',
          '24/7 Access',
          'CCTV',
          'Air Conditioning'
        ],
        priceRange: '$' as const,
      }

      return PureGymLocationSchema.parse(gymData)
    } catch (error) {
      console.warn(`⚠️ Error scraping ${url}:`, error)
      return null
    }
  }

  // Pure function - Geocode address to get coordinates
  private async geocodeAddress(address: string): Promise<{lat: number, lng: number} | null> {
    try {
      // Using a free geocoding service (you might want to use Google Maps API for better results)
      const encodedAddress = encodeURIComponent(`${address}, UK`)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`,
        {
          headers: {
            'User-Agent': 'GymBuddy/1.0 (contact@example.com)', // Replace with your contact
          }
        }
      )

      if (!response.ok) {
        return null
      }

      const data = await response.json()
      
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        }
      }
      
      return null
    } catch (error) {
      console.warn('⚠️ Geocoding failed:', error)
      return null
    }
  }

  // Pure function - Store gyms in database
  async storeGymsInDatabase(gyms: PureGymLocation[]): Promise<void> {
    console.log(`💾 Storing ${gyms.length} gyms in database...`)
    
    const batch = [...gyms].map(gym => ({
      name: gym.name,
      address: gym.address,
      location: { latitude: gym.latitude, longitude: gym.longitude },
      amenities: gym.amenities,
      hours: gym.hours || {},
      images: [], // PureGym images could be scraped separately if needed
      rating: null,
      price_range: gym.priceRange,
    }))

    try {
      // Insert gyms in batches to avoid timeout
      const batchSize = 50
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

      console.log('🎉 Successfully stored all PureGym locations!')
    } catch (error) {
      console.error('❌ Error storing gyms in database:', error)
      throw error
    }
  }

  // Pure function - Main execution method
  async run(): Promise<void> {
    try {
      console.log('🚀 Starting PureGym scraper...')
      
      const locations = await this.fetchPureGymLocations()
      
      if (locations.length === 0) {
        console.log('❌ No PureGym locations found')
        return
      }

      console.log(`📊 Found ${locations.length} PureGym locations`)
      
      await this.storeGymsInDatabase(locations)
      
      console.log('✅ PureGym scraper completed successfully!')
    } catch (error) {
      console.error('❌ PureGym scraper failed:', error)
      process.exit(1)
    }
  }
}

// Script execution
async function main() {
  const scraper = new PureGymScraper()
  await scraper.run()
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error)
}

export { PureGymLocationSchema, PureGymScraper }

