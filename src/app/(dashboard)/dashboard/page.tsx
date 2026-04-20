"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    const rolesJson = localStorage.getItem('user_roles');
    let roles = rolesJson ? JSON.parse(rolesJson) : [];

    // LocalStorage boşsa çerezden bak (Middleware ile senkronizasyon için)
    if (roles.length === 0) {
      const rolesCookie = document.cookie.split('; ').find(row => row.startsWith('user_roles='))?.split('=')[1];
      if (rolesCookie) {
        try {
          roles = JSON.parse(decodeURIComponent(rolesCookie));
        } catch (e) {}
      }
    }

    if (roles.includes('super-admin') || roles.includes('coordinator')) {
      router.push('/dashboard/admin');
    } else if (roles.includes('alumni')) {
      router.push('/dashboard/alumni');
    } else if (roles.includes('student') || roles.length > 0) {
      router.push('/dashboard/student');
    } else {
      // Eğer hiç rol yoksa ama token varsa, bekleyelim veya profil çekelim. 
      // Şimdilik login'e yönlendiriyoruz (en güvenlisi).
      router.push('/login');
    }
  }, [router]);

  return <div className="p-10 text-center">Yönlendiriliyorsunuz...</div>;
}
