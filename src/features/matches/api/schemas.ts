import { z } from "zod"

export const MatchSchema = z.object({
  id: z.string(),
  userId: z.string(),
  partnerId: z.string(),
  gymId: z.string(),
  status: z.enum(["pending", "accepted", "declined", "completed"]),
  scheduledAt: z.date().optional(),
  workoutType: z.string().optional(),
  notes: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const CreateMatchSchema = MatchSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const UpdateMatchSchema = z.object({
  status: z.enum(["accepted", "declined", "completed"]).optional(),
  scheduledAt: z.date().optional(),
  notes: z.string().optional(),
})

export const MatchRequestSchema = z.object({
  partnerId: z.string(),
  gymId: z.string(),
  workoutType: z.string().optional(),
  scheduledAt: z.date().optional(),
  message: z.string().optional(),
})

export const MatchFilterSchema = z.object({
  status: z.enum(["pending", "accepted", "declined", "completed"]).optional(),
  gymId: z.string().optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
})

// Pure function
export function validateMatch(data: unknown): z.infer<typeof MatchSchema> {
  return MatchSchema.parse(data)
}

// Pure function
export function validateMatchRequest(data: unknown): z.infer<typeof MatchRequestSchema> {
  return MatchRequestSchema.parse(data)
}

// Pure function
export function validateMatchFilter(data: unknown): z.infer<typeof MatchFilterSchema> {
  return MatchFilterSchema.parse(data)
} 