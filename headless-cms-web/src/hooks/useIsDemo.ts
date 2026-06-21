import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export function useIsDemo() {
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    const token = Cookies.get('auth_token');
    if (token) {
      try {
        const payloadBase64 = token.split('.')[1];
        const payload = JSON.parse(atob(payloadBase64));
        if (payload.email === 'demo@agusp.com') {
          setIsDemo(true);
        }
      } catch (e) {
        console.error('Failed to parse token in useIsDemo', e);
      }
    }
  }, []);

  return isDemo;
}
