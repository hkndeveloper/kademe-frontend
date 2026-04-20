"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { handleDashboardRedirect } from '@/lib/auth-utils';

export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    const rolesJson = localStorage.getItem('user_roles');
    let roles = rolesJson ? JSON.parse(rolesJson) : [];

    // LocalStorage boşsa çerezden bak
    if (roles.length === 0) {
      const rolesCookie = document.cookie.split('; ').find(row => row.startsWith('user_roles='))?.split('=')[1];
      if (rolesCookie) {
        try {
          const decoded = decodeURIComponent(rolesCookie);
          roles = JSON.parse(decoded.startsWith('%') ? decodeURIComponent(decoded) : decoded);
        } catch (e) {
          try {
            roles = JSON.parse(decodeURIComponent(rolesCookie));
          } catch (e2) {
            roles = [decodeURIComponent(rolesCookie).replace(/["']/g, '')];
          }
        }
      }
    }

    handleDashboardRedirect(router, roles);
  }, [router]);

  return <div className="p-10 text-center">Yönlendiriliyorsunuz...</div>;
}
