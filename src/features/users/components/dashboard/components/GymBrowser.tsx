"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { gymService } from '@/features/gyms/api/gyms'
import { GymSchema } from '@/features/gyms/api/schemas'
import { profileService } from '@/features/users/api/profiles'
import { useEffect, useState } from 'react'
import { z } from 'zod'
import { useAuth } from '../AuthProvider'

interface GymBrowserProps {
  onClose: () => void
}

export function GymBrowser({ onClose }: GymBrowserProps) {
  const { user, refreshProfile } = useAuth()
  const [gyms, setGyms] = useState<z.infer<typeof GymSchema>[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [joiningGymId, setJoiningGymId] = useState<string | null>(null)

  useEffect(() => {
    const loadGyms = async () => {
      try {
        const gymData = await gymService.getGyms()
        setGyms(gymData)
      } catch (error) {
        setError('Failed to load gyms')
        console.error('Error loading gyms:', error)
      } finally {
        setLoading(false)
      }
    }

    loadGyms()
  }, [])

  const handleJoinGym = async (gym: z.infer<typeof GymSchema>) => {
    if (!user) return

    setJoiningGymId(gym.id)
    setError(null)

    try {
      await profileService.updateProfile(user.id, {
        gym: {
          id: gym.id,
          name: gym.name,
          address: gym.address,
        }
      })

      await refreshProfile()
      onClose()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to join gym')
    } finally {
      setJoiningGymId(null)
    }
  }

  const filteredGyms = gyms.filter(gym =>
    gym.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    gym.address.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-hidden border border-slate-200 dark:border-slate-700 shadow-2xl">
        {/* Header */}
        <div className="p-8 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <span className="text-white text-2xl">🏋️</span>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Find Your Gym</h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Choose from our partner locations to start connecting with workout buddies
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

          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-slate-400 text-lg">🔍</span>
            </div>
            <Input
              type="text"
              placeholder="Search gyms by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 text-lg rounded-2xl border-2 border-slate-200 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-slate-800"
            />
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

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-300px)]">
          {loading ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full animate-pulse mx-auto mb-4"></div>
              <p className="text-xl text-slate-600 dark:text-slate-400 font-medium">Finding amazing gyms near you...</p>
            </div>
          ) : filteredGyms.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <p className="text-xl text-slate-600 dark:text-slate-400 font-medium mb-2">
                {searchQuery ? 'No gyms match your search' : 'No gyms available'}
              </p>
              <p className="text-slate-500 dark:text-slate-500">
                {searchQuery ? 'Try adjusting your search terms' : 'Check back later for new locations'}
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-slate-600 dark:text-slate-400">
                  <span className="font-semibold text-slate-900 dark:text-white">{filteredGyms.length}</span> gym{filteredGyms.length !== 1 ? 's' : ''} found
                </p>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredGyms.map((gym) => (
                  <div 
                    key={gym.id} 
                    className="group bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/5 transition-all duration-300 hover:-translate-y-2"
                  >
                    <div className="space-y-4">
                      {/* Gym Header */}
                      <div>
                        <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {gym.name}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                          <span className="text-slate-400 mt-0.5">📍</span>
                          {gym.address}
                        </p>
                      </div>

                      {/* Rating and Price */}
                      <div className="flex items-center justify-between">
                        {gym.rating && (
                          <div className="flex items-center gap-1 px-3 py-1 bg-yellow-50 dark:bg-yellow-900/20 rounded-full">
                            <span className="text-yellow-500">⭐</span>
                            <span className="font-semibold text-yellow-700 dark:text-yellow-400">{gym.rating}</span>
                          </div>
                        )}
                        {gym.priceRange && (
                          <div className="flex items-center gap-1 px-3 py-1 bg-green-50 dark:bg-green-900/20 rounded-full">
                            <span className="font-semibold text-green-700 dark:text-green-400">{gym.priceRange}</span>
                          </div>
                        )}
                      </div>

                      {/* Amenities */}
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Amenities</p>
                        <div className="flex flex-wrap gap-2">
                          {gym.amenities.slice(0, 4).map((amenity) => (
                            <span
                              key={amenity}
                              className="text-xs px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full font-medium"
                            >
                              {amenity}
                            </span>
                          ))}
                          {gym.amenities.length > 4 && (
                            <span className="text-xs px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full font-medium">
                              +{gym.amenities.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Join Button */}
                      <Button
                        onClick={() => handleJoinGym(gym)}
                        disabled={joiningGymId === gym.id}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:transform-none"
                      >
                        {joiningGymId === gym.id ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Joining...
                          </div>
                        ) : (
                          <>🤝 Join This Gym</>
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
} 