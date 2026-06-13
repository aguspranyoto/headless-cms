'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      Cookies.set('auth_token', token, { expires: 1 });
      router.push('/admin');
    } else {
      router.push('/login');
    }
  }, [token, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="text-gray-600 font-medium">Authenticating...</div>
    </div>
  );
}
