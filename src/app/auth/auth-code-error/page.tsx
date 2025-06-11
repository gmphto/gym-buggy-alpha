import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 space-y-4">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20">
            <svg
              className="h-6 w-6 text-red-600 dark:text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>
          <h1 className="mt-4 text-xl font-semibold text-slate-900 dark:text-slate-100">
            Authentication Error
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Something went wrong during the sign-in process. This could be due to:
          </p>
        </div>

        <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
          <ul className="list-disc list-inside space-y-1">
            <li>An expired or invalid authorization code</li>
            <li>Network connectivity issues</li>
            <li>Temporarily unavailable authentication service</li>
            <li>Browser security settings blocking the redirect</li>
          </ul>
        </div>

        <div className="space-y-3">
          <Button asChild className="w-full">
            <Link href="/">Try Again</Link>
          </Button>
          
          <div className="text-center">
            <Link
              href="/"
              className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
            >
              ← Back to Home
            </Link>
          </div>
        </div>

        <div className="mt-6 p-3 bg-slate-50 dark:bg-slate-700 rounded-md">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            <strong>Need help?</strong> If this problem persists, try clearing your browser cookies 
            and cache, or contact support for assistance.
          </p>
        </div>
      </div>
    </div>
  )
} 