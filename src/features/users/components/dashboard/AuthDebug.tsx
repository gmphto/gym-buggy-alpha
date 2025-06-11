"use client"

import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'
import { useAuth } from './AuthProvider'

export function AuthDebug() {
  const { user, profile, loading } = useAuth()
  const [testResult, setTestResult] = useState<string>('')
  const supabase = createClient()

  const testDirectQuery = async () => {
    try {
      setTestResult('Testing...')
      
      // Test 1: Check current session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      console.log('Session:', sessionData, 'Error:', sessionError)
      
      // Test 2: Try direct profiles query
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .limit(1)
      
      console.log('Profiles query:', profilesData, 'Error:', profilesError)
      
      // Test 3: Check RLS status
      const { data: rlsData, error: rlsError } = await supabase
        .rpc('check_table_rls', { table_name: 'profiles' })
        .single()
      
      console.log('RLS check:', rlsData, 'Error:', rlsError)
      
      setTestResult(`
        Session: ${sessionData?.session ? 'Active' : 'None'}
        User ID: ${sessionData?.session?.user?.id || 'None'}
        Profiles Error: ${profilesError?.message || 'None'}
        RLS Error: ${rlsError?.message || 'None'}
      `)
      
    } catch (error) {
      console.error('Test error:', error)
      setTestResult(`Test failed: ${error}`)
    }
  }

  if (loading) {
    return <div className="p-4 bg-yellow-100 text-yellow-800 rounded">Loading auth state...</div>
  }

  return (
    <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg space-y-4">
      <h3 className="font-semibold text-lg">Auth Debug Info</h3>
      
      <div className="space-y-2 text-sm">
        <div><strong>User:</strong> {user ? '✅ Authenticated' : '❌ Not authenticated'}</div>
        <div><strong>User ID:</strong> {user?.id || 'None'}</div>
        <div><strong>Email:</strong> {user?.email || 'None'}</div>
        <div><strong>Profile:</strong> {profile ? '✅ Loaded' : '❌ Not loaded'}</div>
        <div><strong>Profile Name:</strong> {profile?.name || 'None'}</div>
      </div>

      <button 
        onClick={testDirectQuery}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Test Database Connection
      </button>

      {testResult && (
        <div className="p-3 bg-slate-200 dark:bg-slate-700 rounded text-sm">
          <pre>{testResult}</pre>
        </div>
      )}

      <div className="text-xs text-slate-600 dark:text-slate-400">
        Check browser console for detailed logs
      </div>
    </div>
  )
} 