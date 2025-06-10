"use client"

import { Button } from '@/components/ui/button'
import { useAuth } from './AuthProvider'

export function Dashboard() {
  const { user, profile, signOut } = useAuth()

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {profile?.name}!</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Ready to find your workout partner?
          </p>
        </div>
        <Button onClick={signOut} variant="outline">
          Sign Out
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border">
          <h3 className="text-lg font-semibold mb-2">Your Profile</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Email: {user?.email}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Member since: {profile?.createdAt?.toLocaleDateString()}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border">
          <h3 className="text-lg font-semibold mb-2">Current Gym</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {profile?.gym ? profile.gym.name : 'No gym selected'}
          </p>
          {profile?.gym && (
            <p className="text-xs text-slate-500 mt-1">
              {profile.gym.address}
            </p>
          )}
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border">
          <h3 className="text-lg font-semibold mb-2">Matches</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            0 active matches
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Start connecting with gym buddies!
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border">
        <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-full flex items-center justify-center text-sm font-semibold">
              1
            </div>
            <div>
              <h3 className="font-medium">Choose Your Gym</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Select a gym from our partner locations to start finding workout partners.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-full flex items-center justify-center text-sm font-semibold">
              2
            </div>
            <div>
              <h3 className="font-medium">Complete Your Profile</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Add your workout preferences and available times to get better matches.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-full flex items-center justify-center text-sm font-semibold">
              3
            </div>
            <div>
              <h3 className="font-medium">Find Workout Partners</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Browse other members at your gym and send match requests to start working out together.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t">
          <div className="flex gap-4">
            <Button>Browse Gyms</Button>
            <Button variant="outline">Edit Profile</Button>
          </div>
        </div>
      </div>
    </div>
  )
} 