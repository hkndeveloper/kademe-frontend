"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    const rolesJson = localStorage.getItem('user_roles');
    const roles = rolesJson ? JSON.parse(rolesJson) : [];

    if (roles.includes('super-admin') || roles.includes('coordinator')) {
      router.push('/dashboard/admin');
    } else if (roles.includes('alumni')) {
      router.push('/dashboard/alumni');
    } else if (roles.includes('student') || roles.length > 0) {
      router.push('/dashboard/student');
    } else {
      router.push('/login');
    }
  }, [router]);

  return <div className="p-10 text-center">Yönlendiriliyorsunuz...</div>;
}
