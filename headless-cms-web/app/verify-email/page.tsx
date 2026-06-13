'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import { authApi } from '@/lib/api';
import toast from 'react-hot-toast';

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
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Email Verification
        </h2>
        
        {status === 'loading' && (
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Verifying your email address...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-green-600">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            <p className="font-medium text-lg">Email verified!</p>
            <p className="text-gray-500 mt-2">Redirecting you to the dashboard...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="text-red-600">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            <p className="font-medium text-lg">Verification failed</p>
            <p className="text-gray-500 mt-2 mb-6">The link is invalid or has expired.</p>
            <button
              onClick={() => router.push('/login')}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
