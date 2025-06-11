import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' })

async function verifyGyms() {
  console.log('🔍 Verifying gym data in database...')
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase environment variables')
    return
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  
  try {
    // Get exact count using a different method
    const { count, error: countError } = await supabase
      .from('gyms')
      .select('*', { count: 'exact', head: true })
    
    if (countError) {
      console.error('❌ Error getting count:', countError)
    } else {
      console.log(`📊 Total Gyms in Database: ${count}`)
    }

    // Get all gyms with basic info
    const { data: allGyms, error: allError } = await supabase
      .from('gyms')
      .select('id, name, address, created_at')
      .order('created_at', { ascending: false })
    
    if (allError) {
      console.error('❌ Error getting all gyms:', allError)
      return
    }

    console.log(`📋 Found ${allGyms?.length || 0} total gyms`)

    // Check for PureGym entries
    const puregymEntries = allGyms?.filter(gym => 
      gym.name.toLowerCase().includes('puregym') || 
      gym.name.toLowerCase().includes('pure gym')
    ) || []

    console.log(`🏋️ PureGym entries: ${puregymEntries.length}`)

    // Show recent entries
    if (allGyms && allGyms.length > 0) {
      console.log(`\n📅 Most Recent Gyms:`)
      allGyms.slice(0, 10).forEach((gym, index) => {
        console.log(`   ${index + 1}. ${gym.name} (${gym.created_at})`)
      })
    }

    // Show PureGym entries specifically
    if (puregymEntries.length > 0) {
      console.log(`\n🎯 PureGym Locations Found:`)
      puregymEntries.slice(0, 5).forEach((gym, index) => {
        console.log(`   ${index + 1}. ${gym.name} - ${gym.address}`)
      })
    }

    // Check if there are any gyms created today
    const today = new Date().toISOString().split('T')[0]
    const todayGyms = allGyms?.filter(gym => 
      gym.created_at.startsWith(today)
    ) || []

    console.log(`\n🆕 Gyms created today: ${todayGyms.length}`)
    
    if (todayGyms.length > 0) {
      console.log(`   Recent additions:`)
      todayGyms.slice(0, 5).forEach((gym, index) => {
        console.log(`   ${index + 1}. ${gym.name}`)
      })
    }

  } catch (error) {
    console.error('❌ Verification failed:', error)
  }
}

if (require.main === module) {
  verifyGyms().catch(console.error)
}

export { verifyGyms }
