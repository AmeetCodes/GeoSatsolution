'use client'

import React, { useState } from 'react'
import { Eye, EyeOff, ArrowLeft, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { getErrorMessage } from '@/lib/utils'

export interface LoginPageProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

export function LoginPage({ onSuccess, redirectTo = '/admin' }: LoginPageProps) {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })

  const navigate = (path: string) => {
    try {
      router.push(path)
    } catch {
      if (typeof window !== 'undefined') {
        window.location.href = path
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    if (error) setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          rememberMe: formData.rememberMe,
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Invalid email or password')
      }

      if (onSuccess) {
        onSuccess()
      } else {
        navigate(redirectTo)
        // Refresh to update server-side session
        router.refresh()
      }
    } catch (err) {
      setError(getErrorMessage(err, 'Login failed. Please verify credentials.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="absolute top-6 left-6 z-10">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100"
          title="Return to GeoSAT public site"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
              GS
            </div>
            <span className="font-semibold text-slate-900 tracking-tight text-lg">
              GeoSAT Admin
            </span>
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-sm text-slate-700">
            Please enter your authorized administrative credentials to access the console.
          </p>
        </div>

        {error && (
          <div className="mb-6 text-sm text-rose-600">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter administrator password"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 pr-11 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center">
            <label className="flex items-center space-x-2 text-sm text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                className="w-4 h-4 accent-emerald-600 border-slate-200 rounded focus:ring-emerald-500"
              />
              <span>Remember me</span>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Verifying Credentials...</span>
              </>
            ) : (
              <span>Sign In to Admin Portal</span>
            )}
          </button>

        </form>
      </div>
    </div>
  )
}
export default LoginPage;
