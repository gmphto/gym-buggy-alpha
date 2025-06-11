import { createClient } from '@/lib/supabase/client'
import { z } from 'zod'
import { LoginSchema, RegisterSchema } from './schemas'

export class AuthService {
  private supabase = createClient()

  // Pure function
  async signIn(credentials: z.infer<typeof LoginSchema>) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    })

    if (error) {
      throw new Error(error.message)
    }

    return data
  }

  // Pure function
  async signUp(userData: z.infer<typeof RegisterSchema>) {
    const { data, error } = await this.supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          name: userData.name,
        },
      },
    })

    if (error) {
      throw new Error(error.message)
    }

    return data
  }

  // Pure function
  async signInWithGoogle() {
    const { data, error } = await this.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })

    if (error) {
      throw new Error(error.message)
    }

    return data
  }

  // Pure function
  async signOut() {
    const { error } = await this.supabase.auth.signOut()
    
    if (error) {
      throw new Error(error.message)
    }
  }

  // Pure function
  async getCurrentUser() {
    const { data: { user }, error } = await this.supabase.auth.getUser()
    
    if (error) {
      throw new Error(error.message)
    }

    return user
  }

  // Pure function
  async getCurrentSession() {
    const { data: { session }, error } = await this.supabase.auth.getSession()
    
    if (error) {
      throw new Error(error.message)
    }

    return session
  }

  // Pure function
  onAuthStateChange(callback: (user: any) => void) {
    return this.supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user ?? null)
    })
  }

  // Pure function
  async resetPassword(email: string) {
    const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    if (error) {
      throw new Error(error.message)
    }
  }

  // Pure function
  async updatePassword(newPassword: string) {
    const { error } = await this.supabase.auth.updateUser({
      password: newPassword
    })

    if (error) {
      throw new Error(error.message)
    }
  }
}

// Export singleton instance
export const authService = new AuthService() 