import { Role } from "@/lib/permissions";

export const setCookie = (name: string, value: string, days = 7) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
};

export const getCookie = (name: string) => {
  if (typeof document === "undefined") return null;
  return document.cookie.split("; ").reduce((r, v) => {
    const parts = v.split("=");
    return parts[0] === name ? decodeURIComponent(parts[1]) : r;
  }, "");
};

export const removeCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

export const checkRoleAccess = (userRoles: Role[], requiredRoles: Role[]) => {
  if (userRoles.includes("super-admin")) return true;
  return requiredRoles.some(role => userRoles.includes(role));
};

export const handleDashboardRedirect = (router: any, roles: Role[]) => {
  const token = document.cookie.split('; ').find(row => row.startsWith('kademe_token='))?.split('=')[1];
    
  if (!token) {
    router.push('/login');
    return;
  }

  if (roles.includes('super-admin') || roles.includes('coordinator')) {
    router.push('/dashboard/admin');
  } else if (roles.includes('alumni')) {
    router.push('/dashboard/alumni');
  } else if (roles.includes('student') || roles.length > 0) {
    router.push('/dashboard/student');
  } else {
    router.push('/login');
  }
};

export const logout = () => {
  // 1. Clear LocalStorage
  if (typeof window !== "undefined") {
    localStorage.clear();
    sessionStorage.clear();
  }
  
  // 2. Clear Cookies
  removeCookie('kademe_token');
  removeCookie('user_roles');
  removeCookie('user_id');
  
  // 3. Force redirect to login
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
};
