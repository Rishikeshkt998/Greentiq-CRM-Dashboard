'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Leaf, Lock, Mail, Loader2, Eye, EyeOff } from 'lucide-react';
import { loginSchema, LoginSchemaInput } from '@/schemas/auth/login.schema';
import { useAuth } from '@/hooks/auth/use-auth';
import { cn } from '@/lib/utils/cn';

interface AuthModalProps {
  onSuccess: () => void;
}

const DEMO_ACCOUNTS = [
  { label: 'Admin', email: 'admin@greentiq.com', password: 'password123', color: 'text-violet-400 bg-violet-500/10 border-violet-500/30' },
  { label: 'Manager', email: 'manager@greentiq.com', password: 'password123', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
  { label: 'Viewer', email: 'viewer@greentiq.com', password: 'password123', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-md">
      <div className="w-full max-w-md space-y-6 px-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-2xl shadow-violet-500/40">
            <Leaf className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Welcome to Greentiq</h1>
            <p className="text-sm text-muted-foreground">Sign in to your CRM dashboard</p>
          </div>
        </div>

        {/* Demo Accounts */}
        <div className="space-y-2">
          <p className="text-center text-xs font-medium text-muted-foreground">Quick Login with Demo Accounts</p>
          <div className="grid grid-cols-3 gap-2">
            {DEMO_ACCOUNTS.map(account => (
              <button
                key={account.label}
                type="button"
                onClick={() => { setValue('email', account.email); setValue('password', account.password); }}
                className={cn("rounded-xl border px-3 py-2 text-xs font-semibold transition-all hover:opacity-80", account.color)}
              >
                {account.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-2xl border border-white/10 bg-card p-6">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                {...register('email')}
                type="email"
                placeholder="admin@greentiq.com"
                className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              />
            </div>
            {errors.email && <p className="text-[11px] text-red-400">{errors.email.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••"
                className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-9 pr-10 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="text-[11px] text-red-400">{errors.password.message}</p>}
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-70 transition-all"
          >
            {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Signing in...</> : 'Sign In to Dashboard'}
          </button>

          <p className="text-center text-[11px] text-muted-foreground">Demo password: <span className="font-mono text-violet-400">password123</span></p>
        </form>
      </div>
    </div>
  );
}
