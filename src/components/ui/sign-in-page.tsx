'use client';

import { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export interface LoginPageProps {
  onSuccess?: () => void;
  redirectTo?: string;
  initialReason?: string;
}

function getLoginErrorMessage(status?: number, code?: string): string {
  if (code === 'admin_not_found') {
    return "We couldn't find an admin account for that email. Check the address or contact your system administrator.";
  }
  if (code === 'invalid_credentials' || status === 401) {
    return 'Email or password is incorrect. Check your details and try again.';
  }
  if (code === 'rate_limited' || status === 429) {
    return 'There have been too many sign-in attempts. Please wait a few minutes and try again.';
  }
  if (code === 'session_not_configured' || code === 'session_unavailable') {
    return "We couldn't start your admin session. Please try again shortly or contact your system administrator.";
  }
  if (status === 400) {
    return 'Enter a valid email address and password, then try again.';
  }
  return "Sign-in is temporarily unavailable. Please try again shortly. If this continues, contact your system administrator.";
}

export function LoginPage({ onSuccess, redirectTo = '/admin/dashboard', initialReason }: LoginPageProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    initialReason === 'timeout' ? 'Session expired due to inactivity' : null,
  );
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          rememberMe: formData.rememberMe,
        }),
      });

      const data = (await response.json().catch(() => null)) as {
        success?: boolean;
        code?: string;
      } | null;

      if (!response.ok || !data?.success) {
        setError(getLoginErrorMessage(response.status, data?.code));
        return;
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push(redirectTo);
        router.refresh();
      }
    } catch {
      setError(getLoginErrorMessage());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col lg:flex-row font-sans">
      {/* Left Visual Bay */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-slate-950 border-r border-slate-800/80">
        {/* Back Button */}
        <div className="absolute top-6 left-6 z-30">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="w-10 h-10 bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-full flex items-center justify-center hover:bg-slate-800 transition-all text-white shadow-lg"
            aria-label="Back to website"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Background Satellite Visual */}
        <div className="absolute inset-0 z-0">
          <Image
            alt="GeoSAT Satellite Topography"
            className="object-cover opacity-60 mix-blend-luminosity scale-105"
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1800&auto=format&fit=crop"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        </div>

        {/* Bottom Typography & Elevated Status Badge */}
        <div className="relative z-10 mt-auto p-12 text-white">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-teal-950/60 backdrop-blur-md border border-teal-500/30 shadow-[0_0_20px_rgba(20,184,166,0.15)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
            </span>
            <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-teal-300 uppercase">
              GEOSAT CONSOLE ACCESS
            </span>
          </div>

          <h2 className="font-heading font-extrabold text-3xl lg:text-4xl text-white tracking-tight leading-[1.15] mt-4 mb-3">
            Enterprise Geospatial Intelligence Platform
          </h2>
          <p className="font-sans text-slate-300 text-sm leading-relaxed max-w-md">
            Centralized telemetry dashboard for UAV photogrammetry, GNSS CORS network management, and district project mapping across Nepal.
          </p>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex flex-1 items-center justify-center bg-white p-8 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          <div>
            <Link
              href="/"
              className="mb-8 inline-flex items-center gap-2 font-sans text-xs font-semibold text-slate-500 transition-colors hover:text-teal-600 lg:hidden"
            >
              <ArrowLeft className="size-4" />
              Back to website
            </Link>
            <h1 className="font-heading text-3xl font-bold tracking-tight text-slate-900 mb-2">
              Welcome Back
            </h1>
            <p className="font-sans text-sm text-slate-600">
              Admin access is managed by your GeoSAT administrator.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 font-sans text-sm text-rose-700"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="admin-email"
                className="mb-2 block font-sans text-xs font-semibold uppercase tracking-wider text-slate-600"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  id="admin-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 font-sans text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="mb-2 block font-sans text-xs font-semibold uppercase tracking-wider text-slate-600"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-12 font-sans text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-500 hover:bg-slate-100"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center text-xs font-sans">
              <label className="flex cursor-pointer items-center space-x-2 text-slate-600">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="h-4 w-4 rounded border-slate-300 text-teal-600 accent-teal-600 focus:ring-teal-500"
                />
                <span>Remember session</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3.5 font-heading text-sm font-semibold text-white shadow-lg shadow-teal-900/20 transition-all duration-200 hover:bg-teal-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In to Console'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
