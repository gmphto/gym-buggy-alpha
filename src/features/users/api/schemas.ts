import { z } from "zod"

const AvailabilitySchema = z.object({
  monday: z.object({
    morning: z.boolean().default(false),
    afternoon: z.boolean().default(false),
    evening: z.boolean().default(false),
  }).default({}),
  tuesday: z.object({
    morning: z.boolean().default(false),
    afternoon: z.boolean().default(false),
    evening: z.boolean().default(false),
  }).default({}),
  wednesday: z.object({
    morning: z.boolean().default(false),
    afternoon: z.boolean().default(false),
    evening: z.boolean().default(false),
  }).default({}),
  thursday: z.object({
    morning: z.boolean().default(false),
    afternoon: z.boolean().default(false),
    evening: z.boolean().default(false),
  }).default({}),
  friday: z.object({
    morning: z.boolean().default(false),
    afternoon: z.boolean().default(false),
    evening: z.boolean().default(false),
  }).default({}),
  saturday: z.object({
    morning: z.boolean().default(false),
    afternoon: z.boolean().default(false),
    evening: z.boolean().default(false),
  }).default({}),
  sunday: z.object({
    morning: z.boolean().default(false),
    afternoon: z.boolean().default(false),
    evening: z.boolean().default(false),
  }).default({}),
}).default({})

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().min(1),
  bio: z.string().optional(),
  age: z.number().int().min(13).max(120).optional(),
  fitnessLevel: z.enum(["beginner", "intermediate", "advanced"]).default("beginner"),
  workoutPreferences: z.array(z.string()).default([]),
  availability: AvailabilitySchema,
  profileImage: z.string().url().optional(),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
    address: z.string().optional(),
  }).optional(),
  gym: z.object({
    id: z.string(),
    name: z.string(),
    address: z.string(),
  }).optional(),
  preferences: z.object({
    maxDistance: z.number().default(10), // km
    workoutTypes: z.array(z.string()).default([]),
    availableHours: z.array(z.string()).default([]),
  }).default({}),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const CreateUserSchema = UserSchema.omit({
  createdAt: true,
  updatedAt: true,
})

export const CreateUserInputSchema = UserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const UpdateUserSchema = CreateUserSchema.partial()

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const RegisterSchema = LoginSchema.merge(
  z.object({
    name: z.string().min(1, "Name is required"),
    confirmPassword: z.string(),
  })
).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// Pure function
export function validateUser(data: unknown): z.infer<typeof UserSchema> {
  return UserSchema.parse(data)
}

// Pure function  
export function validateLogin(data: unknown): z.infer<typeof LoginSchema> {
  return LoginSchema.parse(data)
}

// Pure function
export function validateRegister(data: unknown): z.infer<typeof RegisterSchema> {
  return RegisterSchema.parse(data)
} 