"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { profileService } from '@/features/users/api/profiles'
import { useEffect, useState } from 'react'
import { useAuth } from '../AuthProvider'

interface ProfileEditorProps {
  onClose: () => void
}

export function ProfileEditor({ onClose }: ProfileEditorProps) {
  const { user, profile, refreshProfile } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    age: '',
    fitnessLevel: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    workoutPreferences: [] as string[],
    availability: {
      monday: { morning: false, afternoon: false, evening: false },
      tuesday: { morning: false, afternoon: false, evening: false },
      wednesday: { morning: false, afternoon: false, evening: false },
      thursday: { morning: false, afternoon: false, evening: false },
      friday: { morning: false, afternoon: false, evening: false },
      saturday: { morning: false, afternoon: false, evening: false },
      sunday: { morning: false, afternoon: false, evening: false },
    }
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize form with current profile data
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        bio: profile.bio || '',
        age: profile.age?.toString() || '',
        fitnessLevel: profile.fitnessLevel || 'beginner',
        workoutPreferences: profile.workoutPreferences || [],
        availability: profile.availability || {
          monday: { morning: false, afternoon: false, evening: false },
          tuesday: { morning: false, afternoon: false, evening: false },
          wednesday: { morning: false, afternoon: false, evening: false },
          thursday: { morning: false, afternoon: false, evening: false },
          friday: { morning: false, afternoon: false, evening: false },
          saturday: { morning: false, afternoon: false, evening: false },
          sunday: { morning: false, afternoon: false, evening: false },
        }
      })
    }
  }, [profile])

  const workoutOptions = [
    'Weightlifting',
    'Cardio',
    'CrossFit',
    'Yoga',
    'Pilates',
    'Swimming',
    'Rock Climbing',
    'Martial Arts',
    'Dance',
    'Group Classes',
  ]

  const handleWorkoutPreferenceToggle = (preference: string) => {
    setFormData(prev => ({
      ...prev,
      workoutPreferences: prev.workoutPreferences.includes(preference)
        ? prev.workoutPreferences.filter(p => p !== preference)
        : [...prev.workoutPreferences, preference]
    }))
  }

  const handleAvailabilityToggle = (day: string, timeSlot: string) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: {
          ...prev.availability[day as keyof typeof prev.availability],
          [timeSlot]: !prev.availability[day as keyof typeof prev.availability][timeSlot as keyof typeof prev.availability.monday]
        }
      }
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      await profileService.updateProfile(user.id, {
        name: formData.name,
        bio: formData.bio || undefined,
        age: formData.age ? parseInt(formData.age) : undefined,
        fitnessLevel: formData.fitnessLevel,
        workoutPreferences: formData.workoutPreferences,
        availability: formData.availability,
      })

      await refreshProfile()
      onClose()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  const timeSlots = [
    { key: 'morning', label: 'Morning', icon: '🌅', time: '6-12' },
    { key: 'afternoon', label: 'Afternoon', icon: '☀️', time: '12-18' },
    { key: 'evening', label: 'Evening', icon: '🌙', time: '18-22' }
  ]

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-5xl w-full max-h-[95vh] overflow-hidden border border-slate-200 dark:border-slate-700 shadow-2xl">
        {/* Header */}
        <div className="p-8 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-slate-800 dark:to-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
                <span className="text-white text-2xl">✨</span>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Edit Your Profile</h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Update your preferences to find the perfect workout partners
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={onClose}
              className="rounded-full w-10 h-10 p-0 border-2 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              ✕
            </Button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800">
            <div className="flex items-center gap-3">
              <span className="text-red-500 text-xl">⚠️</span>
              <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto max-h-[calc(95vh-200px)]">
          <div className="space-y-8">
            {/* Basic Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Basic Information</h3>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                    className="rounded-xl border-2 border-slate-200 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 px-4 py-3"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="age" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    min="13"
                    max="120"
                    value={formData.age}
                    onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                    className="rounded-xl border-2 border-slate-200 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 px-4 py-3"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="bio" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell others about yourself and your fitness goals..."
                  rows={4}
                  className="rounded-xl border-2 border-slate-200 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 px-4 py-3 resize-none"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="fitness-level" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Fitness Level</Label>
                <select
                  id="fitness-level"
                  value={formData.fitnessLevel}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    fitnessLevel: e.target.value as 'beginner' | 'intermediate' | 'advanced'
                  }))}
                  className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 outline-none"
                >
                  <option value="beginner">🌱 Beginner</option>
                  <option value="intermediate">💪 Intermediate</option>
                  <option value="advanced">🔥 Advanced</option>
                </select>
              </div>
            </div>

            {/* Workout Preferences */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">2</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Workout Preferences</h3>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                {workoutOptions.map((option) => (
                  <label key={option} className="group flex items-center gap-3 p-4 rounded-xl border-2 border-slate-200 dark:border-slate-600 hover:border-purple-300 dark:hover:border-purple-500 cursor-pointer transition-all duration-200 hover:bg-purple-50 dark:hover:bg-purple-900/10">
                    <input
                      type="checkbox"
                      checked={formData.workoutPreferences.includes(option)}
                      onChange={() => handleWorkoutPreferenceToggle(option)}
                      className="w-5 h-5 rounded border-2 border-slate-300 dark:border-slate-600 text-purple-600 focus:ring-purple-500 focus:ring-2"
                    />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-purple-700 dark:group-hover:text-purple-300">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">3</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Weekly Availability</h3>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                <div className="grid gap-4">
                  <div className="grid grid-cols-4 gap-4 items-center text-center">
                    <div></div>
                    {timeSlots.map(slot => (
                      <div key={slot.key} className="p-3 bg-white dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600">
                        <div className="text-lg mb-1">{slot.icon}</div>
                        <div className="font-semibold text-sm text-slate-700 dark:text-slate-300">{slot.label}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{slot.time}</div>
                      </div>
                    ))}
                  </div>
                  
                  {days.map(day => (
                    <div key={day} className="grid grid-cols-4 gap-4 items-center">
                      <div className="p-3 text-center">
                        <div className="font-semibold text-slate-700 dark:text-slate-300 capitalize">{day}</div>
                      </div>
                      {timeSlots.map(slot => (
                        <div key={slot.key} className="text-center">
                          <button
                            type="button"
                            onClick={() => handleAvailabilityToggle(day, slot.key)}
                            className={`w-full p-3 rounded-xl border-2 transition-all duration-200 ${
                              formData.availability[day as keyof typeof formData.availability][slot.key as keyof typeof formData.availability.monday]
                                ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg'
                                : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-emerald-300 dark:hover:border-emerald-500'
                            }`}
                          >
                            {formData.availability[day as keyof typeof formData.availability][slot.key as keyof typeof formData.availability.monday] ? '✓' : '○'}
                          </button>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-4">
            <Button 
              type="submit" 
              disabled={loading} 
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving Changes...
                </div>
              ) : (
                <>✨ Save Profile</>
              )}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="flex-1 sm:flex-none border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 py-4 rounded-xl transition-all duration-300"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 