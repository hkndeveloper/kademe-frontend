/**
 * KADEME Permission System
 * Defines roles, abilities, and project-based access logic.
 */

export type Role = 'super-admin' | 'coordinator' | 'student' | 'alumni' | 'personel';

export interface User {
  id: number;
  name: string;
  email: string;
  roles: Role[];
  permissions?: string[]; // Granular abilities like 'create-project', 'delete-blog'
  projects?: number[];    // Project IDs the user is enrolled in/managing
}

export const hasAbility = (user: User | null, ability: string): boolean => {
  if (!user || !user.roles) return false;
  
  // Super Admin bypasses all checks
  if (Array.isArray(user.roles) && user.roles.includes('super-admin')) return true;

  // Check specific permissions array
  if (user.permissions?.includes(ability)) return true;

  // Role-based defaults (if permissions array isn't enough)
  switch (ability) {
    case 'view-dashboard':
    case 'manage-projects':
    case 'manage-participants':
    case 'manage-applications':
    case 'view-calendar':
    case 'manage-kpd':
      return user.roles.includes('coordinator') || user.roles.includes('super-admin');
    case 'view-audit-logs':
    case 'manage-coordinators':
    case 'manage-settings':
    case 'manage-permissions':
    case 'manage-users':
    case 'manage-blacklist':
    case 'manage-announcements':
    case 'manage-gamification':
    case 'write-blog':
      return user.roles.includes('super-admin');
    default:
      return false;
  }
};

export const isInProject = (user: User | null, projectId: number | string): boolean => {
  if (!user) return false;
  if (user.roles.includes('super-admin')) return true;
  
  // Convert to number if necessary
  const pid = typeof projectId === 'string' ? parseInt(projectId) : projectId;
  return user.projects?.includes(pid) || false;
};

export const getDashboardRedirect = (roles: Role[]): string => {
  if (roles.includes('super-admin') || roles.includes('coordinator')) return '/dashboard/admin';
  if (roles.includes('alumni')) return '/dashboard/alumni';
  return '/dashboard/student';
};
