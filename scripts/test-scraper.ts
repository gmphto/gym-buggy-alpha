import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { getDefaultPureGymAmenities, getFallbackPureGymLocations } from './puregym-data'

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' })

// Pure function - Test the database connection and schema
async function testDatabaseConnection() {
  console.log('🔍 Testing database connection...')
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase environment variables')
    console.log('Please ensure these are set in your .env.local file:')
    console.log('- NEXT_PUBLIC_SUPABASE_URL')
    console.log('- SUPABASE_SERVICE_ROLE_KEY')
    return false
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Test basic connection
    const { data, error } = await supabase.from('gyms').select('count').limit(1)
    
    if (error) {
      console.error('❌ Database connection error:', error.message)
      return false
    }
    
    console.log('✅ Database connection successful')
    return true
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    return false
  }
}

// Pure function - Test the fallback data
function testFallbackData() {
  console.log('🔍 Testing fallback data...')
  
  try {
    const locations = getFallbackPureGymLocations()
    const amenities = getDefaultPureGymAmenities()
    
    if (locations.length === 0) {
      console.error('❌ No fallback locations found')
      return false
    }
    
    if (amenities.length === 0) {
      console.error('❌ No default amenities found')
      return false
    }
    
    console.log(`✅ Found ${locations.length} fallback locations`)
    console.log(`✅ Found ${amenities.length} default amenities`)
    
    // Test a few locations
    console.log('📍 Sample locations:')
    locations.slice(0, 3).forEach((location, index) => {
      console.log(`   ${index + 1}. ${location.name} - ${location.address}`)
    })
    
    return true
  } catch (error) {
    console.error('❌ Fallback data test failed:', error)
    return false
  }
}

// Pure function - Test network connectivity
async function testNetworkConnectivity() {
  console.log('🔍 Testing network connectivity...')
  
  try {
    // Test basic HTTP connectivity
    const response = await fetch('https://httpbin.org/status/200', {
      method: 'GET'
    })
    
    if (!response.ok) {
      console.error('❌ Network test failed')
      return false
    }
    
    console.log('✅ Network connectivity confirmed')
    return true
  } catch (error) {
    console.error('❌ Network connectivity test failed:', error)
    return false
  }
}

// Pure function - Test external APIs availability
async function testExternalAPIs() {
  console.log('🔍 Testing external APIs...')
  
  let results = {
    openstreetmap: false,
    googlePlaces: false
  }
  
  // Test OpenStreetMap/Overpass API
  try {
    const osmResponse = await fetch('https://overpass-api.de/api/status')
    results.openstreetmap = osmResponse.ok
    console.log(`${results.openstreetmap ? '✅' : '❌'} OpenStreetMap API`)
  } catch (error) {
    console.log('❌ OpenStreetMap API - Not accessible')
  }
  
  // Test Google Places API (if key provided)
  const googleApiKey = process.env.GOOGLE_PLACES_API_KEY
  if (googleApiKey) {
    try {
      const googleResponse = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=51.5074,-0.1278&radius=1000&type=gym&key=${googleApiKey}`
      )
      results.googlePlaces = googleResponse.ok
      console.log(`${results.googlePlaces ? '✅' : '❌'} Google Places API`)
    } catch (error) {
      console.log('❌ Google Places API - Error with request')
    }
  } else {
    console.log('⚠️ Google Places API key not provided (optional)')
  }
  
  return results
}

// Pure function - Main test runner
async function runTests() {
  console.log('🚀 Running PureGym Scraper Tests...\n')
  
  const results = {
    database: false,
    fallbackData: false,
    network: false,
    apis: { openstreetmap: false, googlePlaces: false }
  }
  
  // Run all tests
  results.database = await testDatabaseConnection()
  console.log('')
  
  results.fallbackData = testFallbackData()
  console.log('')
  
  results.network = await testNetworkConnectivity()
  console.log('')
  
  results.apis = await testExternalAPIs()
  console.log('')
  
  // Summary
  console.log('📊 Test Summary:')
  console.log(`   Database Connection: ${results.database ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`   Fallback Data: ${results.fallbackData ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`   Network Connectivity: ${results.network ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`   OpenStreetMap API: ${results.apis.openstreetmap ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`   Google Places API: ${results.apis.googlePlaces ? '✅ PASS' : '⚠️ SKIP (no key)'}`)
  
  console.log('')
  
  if (results.database && results.fallbackData) {
    console.log('🎉 Core requirements met! You can run the scrapers.')
    console.log('💡 Recommended: Start with `npm run scrape:puregym` for basic functionality')
    
    if (results.network && (results.apis.openstreetmap || results.apis.googlePlaces)) {
      console.log('🚀 Enhanced functionality available! Try `npm run scrape:puregym:enhanced`')
    }
  } else {
    console.log('❌ Core requirements not met. Please fix the issues above before running scrapers.')
  }
  
  return results
}

// Script execution
if (require.main === module) {
  runTests().catch(console.error)
}

export { runTests }
