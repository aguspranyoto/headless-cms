'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import { authApi } from '@/lib/api';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const hasAttempted = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      toast.error('No verification token provided');
      return;
    }

    if (hasAttempted.current) return;
    hasAttempted.current = true;

    authApi.verifyEmail(token)
      .then((response) => {
        setStatus('success');
        Cookies.set('auth_token', response.access_token, { expires: 1 });
        toast.success('Email verified successfully!');
        // Small delay to let user see success message before redirecting
        setTimeout(() => {
          router.push('/admin');
        }, 2000);
      })
      .catch((error) => {
        console.error(error);
        setStatus('error');
        toast.error(error.response?.data?.message || 'Verification failed. The token may be invalid or expired.');
      });
  }, [token, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Email Verification</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center pt-4">
          {status === 'loading' && (
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-muted-foreground">Verifying your email address...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-green-600 flex flex-col items-center">
              <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="font-medium text-lg">Email verified!</p>
              <p className="text-muted-foreground mt-2">Redirecting you to the dashboard...</p>
            </div>
          )}

          {status === 'error' && (
            <div className="text-destructive flex flex-col items-center">
              <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <p className="font-medium text-lg">Verification failed</p>
              <p className="text-muted-foreground mt-2 mb-6">The link is invalid or has expired.</p>
              <Button onClick={() => router.push('/login')} className="w-full max-w-xs">
                Back to Login
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
