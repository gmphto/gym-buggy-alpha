"use client"

import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { AuthDebug } from './AuthDebug'
import { useAuth } from './AuthProvider'
import { GymBrowser } from './components/GymBrowser'
import { ProfileEditor } from './components/ProfileEditor'

export function Dashboard() {
  const { user, profile, signOut } = useAuth()
  const [showGymBrowser, setShowGymBrowser] = useState(false)
  const [showProfileEditor, setShowProfileEditor] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* Temporary Debug Section */}
      <AuthDebug />

      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">💪</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">Gym Buddy</h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">Find your workout partner</p>
              </div>
            </div>
            <Button onClick={signOut} variant="outline" className="text-sm">
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">{profile?.name || 'Fitness Enthusiast'}</span>! 💪
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Ready to find your perfect workout partner and crush your fitness goals together?
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-3 mb-12">
          <div className="group bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">👤</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Your Profile</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Personal info</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                📧 {user?.email}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                📅 Member since {profile?.createdAt?.toLocaleDateString()}
              </p>
              {profile?.fitnessLevel && (
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  🎯 {profile.fitnessLevel.charAt(0).toUpperCase() + profile.fitnessLevel.slice(1)} level
                </p>
              )}
            </div>
          </div>

          <div className="group bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">🏋️</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Current Gym</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Your home base</p>
              </div>
            </div>
            <div className="space-y-2">
              {profile?.gym ? (
                <>
                  <p className="font-medium text-slate-900 dark:text-white">{profile.gym.name}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">📍 {profile.gym.address}</p>
                </>
              ) : (
                <p className="text-slate-600 dark:text-slate-400">No gym selected yet</p>
              )}
            </div>
          </div>

          <div className="group bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">🤝</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Workout Matches</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Your connections</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">0</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Start connecting with gym buddies!
              </p>
            </div>
          </div>
        </div>

        {/* Action Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-lg">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              🚀 Get Started on Your Fitness Journey
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Follow these simple steps to find your ideal workout partner and start achieving your fitness goals together.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">1</span>
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">🏋️ Choose Your Gym</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Select from our partner gyms to start finding workout partners in your area.
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">2</span>
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">✨ Complete Your Profile</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Add your preferences, availability, and fitness goals for better matching.
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-800">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">3</span>
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">🤝 Find Partners</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Connect with like-minded fitness enthusiasts and start working out together.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => setShowGymBrowser(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              🏋️ Browse Gyms
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowProfileEditor(true)}
              className="border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 px-8 py-3 text-lg font-semibold rounded-xl transition-all duration-300"
            >
              ✨ Edit Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showGymBrowser && (
        <GymBrowser onClose={() => setShowGymBrowser(false)} />
      )}
      
      {showProfileEditor && (
        <ProfileEditor onClose={() => setShowProfileEditor(false)} />
      )}
    </div>
  )
} 