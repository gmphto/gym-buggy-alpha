import { z } from "zod"

export const GymSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  address: z.string().min(1),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
  amenities: z.array(z.string()).default([]),
  hours: z.object({
    monday: z.string().optional(),
    tuesday: z.string().optional(),
    wednesday: z.string().optional(),
    thursday: z.string().optional(),
    friday: z.string().optional(),
    saturday: z.string().optional(),
    sunday: z.string().optional(),
  }).default({}),
  images: z.array(z.string().url()).default([]),
  rating: z.number().min(0).max(5).optional(),
  priceRange: z.enum(["$", "$$", "$$$"]).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const CreateGymSchema = GymSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const UpdateGymSchema = CreateGymSchema.partial()

export const GymSearchSchema = z.object({
  query: z.string().optional(),
  latitude: z.number(),
  longitude: z.number(),
  radius: z.number().default(10), // km
  amenities: z.array(z.string()).default([]),
  priceRange: z.array(z.enum(["$", "$$", "$$$"])).default([]),
})

// Pure function
export function validateGym(data: unknown): z.infer<typeof GymSchema> {
  return GymSchema.parse(data)
}

// Pure function
export function validateGymSearch(data: unknown): z.infer<typeof GymSearchSchema> {
  return GymSearchSchema.parse(data)
} 