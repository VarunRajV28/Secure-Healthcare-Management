'use client';

import React from "react"

import { useState } from 'react';
import { ArrowLeft, Mail, Lock, User, Code } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RegisterPageProps {
  onSuccess: (role: 'patient' | 'doctor') => void;
  onBackToLogin: () => void;
}

export default function RegisterPage({ onSuccess, onBackToLogin }: RegisterPageProps) {
  const [step, setStep] = useState<'form' | 'email-verify'>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
    role: 'patient' as 'patient' | 'provider',
  });
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/auth/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle validation errors
        const errorMessage = typeof data.error === 'string' 
          ? data.error 
          : Object.values(data).flat().join(', ');
        
        toast({
          title: 'Registration Failed',
          description: errorMessage,
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      // Registration successful
      toast({
        title: 'Registration Successful!',
        description: 'Your account has been created. Please log in.',
      });

      // Redirect to login after short delay
      setTimeout(() => {
        onBackToLogin();
      }, 2000);

    } catch (error) {
      toast({
        title: 'Error',
        description: 'Network error. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyEmail = (e: React.FormEvent) => {
    e.preventDefault();
    // Determine role based on invitation code
    const role = formData.invitationCode.includes('doc') ? 'doctor' : 'patient';
    onSuccess(role);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={onBackToLogin}
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back to Login</span>
          </button>
        </div>
      </div>

      {/* Registration Form */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-border bg-card p-8">
            {/* Title */}
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {step === 'form' ? 'Create Account' : 'Verify Email'}
            </h2>
            <p className="text-muted-foreground mb-8">
              {step === 'form'
                ? 'Join SecureMed to access healthcare services'
                : 'Check your email for verification link'}
            </p>

            {/* Form Step */}
            {step === 'form' && (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Username Input */}
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-foreground mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <input
                      id="username"
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder="johndoe"
                      className="w-full rounded-lg border border-border bg-background px-10 py-2.5 text-foreground placeholder-muted-foreground outline-none focus:ring-2 focus:ring-primary/50"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="you@example.com"
                      className="w-full rounded-lg border border-border bg-background px-10 py-2.5 text-foreground placeholder-muted-foreground outline-none focus:ring-2 focus:ring-primary/50"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <input
                      id="password"
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="••••••••••••"
                      className="w-full rounded-lg border border-border bg-background px-10 py-2.5 text-foreground placeholder-muted-foreground outline-none focus:ring-2 focus:ring-primary/50"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Must be at least 12 characters with 1 special character
                  </p>
                </div>

                {/* Confirm Password Input */}
                <div>
                  <label htmlFor="password_confirm" className="block text-sm font-medium text-foreground mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <input
                      id="password_confirm"
                      type="password"
                      name="password_confirm"
                      value={formData.password_confirm}
                      onChange={handleInputChange}
                      placeholder="••••••••••••"
                      className="w-full rounded-lg border border-border bg-background px-10 py-2.5 text-foreground placeholder-muted-foreground outline-none focus:ring-2 focus:ring-primary/50"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    I am a:
                  </label>
                  <div className="flex gap-4">
                    <label className="flex-1 relative">
                      <input
                        type="radio"
                        name="role"
                        value="patient"
                        checked={formData.role === 'patient'}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value as 'patient' | 'provider' })}
                        className="peer sr-only"
                        disabled={isLoading}
                      />
                      <div className="cursor-pointer rounded-lg border-2 border-border bg-background px-4 py-3 text-center transition-all peer-checked:border-primary peer-checked:bg-primary/10">
                        <span className="font-medium">Patient</span>
                      </div>
                    </label>
                    <label className="flex-1 relative">
                      <input
                        type="radio"
                        name="role"
                        value="provider"
                        checked={formData.role === 'provider'}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value as 'patient' | 'provider' })}
                        className="peer sr-only"
                        disabled={isLoading}
                      />
                      <div className="cursor-pointer rounded-lg border-2 border-border bg-background px-4 py-3 text-center transition-all peer-checked:border-primary peer-checked:bg-primary/10">
                        <span className="font-medium">Healthcare Provider</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>
            )}

            {/* Verify Email Step */}
            {step === 'email-verify' && (
              <div className="text-center space-y-5">
                <p className="text-sm text-muted-foreground">
                  Email verification coming soon...
                </p>
                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 font-medium text-foreground hover:bg-muted transition-colors"
                >
                  Back
                </button>
              </div>
            )}

            {/* Login Link */}
            <p className="mt-6 text-center text-sm text-muted-foreground">
              {'Already have an account? '}
              <button
                onClick={onBackToLogin}
                className="font-semibold text-primary hover:underline"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
