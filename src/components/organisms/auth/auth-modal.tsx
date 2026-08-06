'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Leaf, Lock, Mail, Loader2, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { loginSchema, LoginSchemaInput } from '@/schemas/auth/login.schema';
import { useAuth } from '@/hooks/auth/use-auth';
import { cn } from '@/lib/utils/cn';

interface AuthModalProps {
  onSuccess: () => void;
}

const DEMO_ACCOUNTS = [
  { label: 'Admin', email: 'admin@greentiq.com', password: 'password123', color: 'text-violet-400 bg-violet-500/15 border-violet-500/40 hover:bg-violet-500/25' },
  { label: 'Manager', email: 'manager@greentiq.com', password: 'password123', color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/40 hover:bg-emerald-500/25' },
  { label: 'Viewer', email: 'viewer@greentiq.com', password: 'password123', color: 'text-amber-400 bg-amber-500/15 border-amber-500/40 hover:bg-amber-500/25' },
];

export function AuthModal({ onSuccess }: AuthModalProps) {
  const { login, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<LoginSchemaInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: LoginSchemaInput) => {
    setError('');
    try {
      await login(values.email, values.password);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
      {/* Main Outer Box Container */}
      <div className="w-full max-w-md rounded-2xl border border-border/80 bg-card shadow-2xl p-7 space-y-6 transition-all duration-200">

        {/* ── 1. Top Logo & Header Section ── */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/30">
            <Leaf className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-foreground tracking-tight">Welcome to Greentiq</h1>
            <p className="text-xs text-muted-foreground mt-0.5 font-normal">Sign in to your CRM dashboard</p>
          </div>
        </div>

        {/* ── 2. Quick Demo Accounts Container Box ── */}
        <div className="rounded-xl border border-border/60 bg-muted/30 p-3.5 space-y-2">
          <div className="flex items-center justify-between px-0.5">
            <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />
              Quick Login with Demo Accounts
            </span>
            <span className="text-[10px] text-muted-foreground/70 font-mono">Select role</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {DEMO_ACCOUNTS.map((account) => (
              <button
                key={account.label}
                type="button"
                onClick={() => {
                  setValue('email', account.email);
                  setValue('password', account.password);
                }}
                className={cn(
                  'rounded-lg border px-3 py-2 text-xs font-bold transition-all text-center cursor-pointer shadow-2xs',
                  account.color
                )}
              >
                {account.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── 3. Credentials Form Section ── */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Address */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground/90">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                {...register('email')}
                type="email"
                placeholder="name@company.com"
                className="w-full rounded-xl border border-border/80 bg-muted/40 py-2.5 pl-9 pr-4 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-normal"
              />
            </div>
            {errors.email && <p className="text-[10px] text-red-500 font-medium">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground/90">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                className="w-full rounded-xl border border-border/80 bg-muted/40 py-2.5 pl-9 pr-10 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-normal"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="text-[10px] text-red-500 font-medium">{errors.password.message}</p>}
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 py-3 text-xs font-bold text-white shadow-lg shadow-blue-500/25 disabled:opacity-70 transition-all cursor-pointer"
          >
            {isLoading ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Signing in...</>
            ) : (
              'Sign In to Dashboard'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
