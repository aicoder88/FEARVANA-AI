import { UserRole } from '@prisma/client';

/**
 * Permission actions
 */
export enum Permission {
  // Content permissions
  CONTENT_CREATE = 'content:create',
  CONTENT_READ = 'content:read',
  CONTENT_UPDATE = 'content:update',
  CONTENT_DELETE = 'content:delete',
  CONTENT_READ_PRIVATE = 'content:read_private',

  // Processing permissions
  PROCESSING_TRIGGER = 'processing:trigger',
  PROCESSING_VIEW = 'processing:view',
  PROCESSING_CANCEL = 'processing:cancel',

  // Search permissions
  SEARCH_EXECUTE = 'search:execute',
  SEARCH_ADVANCED = 'search:advanced',

  // User management permissions
  USER_CREATE = 'user:create',
  USER_READ = 'user:read',
  USER_UPDATE = 'user:update',
  USER_DELETE = 'user:delete',

  // System permissions
  SYSTEM_SETTINGS = 'system:settings',
  SYSTEM_AUDIT = 'system:audit',
  SYSTEM_ANALYTICS = 'system:analytics',
}

/**
 * Role-based permissions mapping
 */
export const rolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    // All permissions
    Permission.CONTENT_CREATE,
    Permission.CONTENT_READ,
    Permission.CONTENT_UPDATE,
    Permission.CONTENT_DELETE,
    Permission.CONTENT_READ_PRIVATE,
    Permission.PROCESSING_TRIGGER,
    Permission.PROCESSING_VIEW,
    Permission.PROCESSING_CANCEL,
    Permission.SEARCH_EXECUTE,
    Permission.SEARCH_ADVANCED,
    Permission.USER_CREATE,
    Permission.USER_READ,
    Permission.USER_UPDATE,
    Permission.USER_DELETE,
    Permission.SYSTEM_SETTINGS,
    Permission.SYSTEM_AUDIT,
    Permission.SYSTEM_ANALYTICS,
  ],

  [UserRole.EDITOR]: [
    // Content management
    Permission.CONTENT_CREATE,
    Permission.CONTENT_READ,
    Permission.CONTENT_UPDATE,
    Permission.CONTENT_DELETE,
    Permission.CONTENT_READ_PRIVATE,
    // Processing
    Permission.PROCESSING_TRIGGER,
    Permission.PROCESSING_VIEW,
    Permission.PROCESSING_CANCEL,
    // Search
    Permission.SEARCH_EXECUTE,
    Permission.SEARCH_ADVANCED,
    // Analytics
    Permission.SYSTEM_ANALYTICS,
  ],

  [UserRole.VIEWER]: [
    // Read-only access
    Permission.CONTENT_READ,
    Permission.SEARCH_EXECUTE,
    Permission.PROCESSING_VIEW,
  ],

  [UserRole.API_CLIENT]: [
    // Programmatic access
    Permission.CONTENT_CREATE,
    Permission.CONTENT_READ,
    Permission.CONTENT_UPDATE,
    Permission.SEARCH_EXECUTE,
    Permission.SEARCH_ADVANCED,
    Permission.PROCESSING_TRIGGER,
    Permission.PROCESSING_VIEW,
  ],
};

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) ?? false;
}

/**
 * Check if a role has any of the specified permissions
 */
export function hasAnyPermission(role: UserRole, permissions: Permission[]): boolean {
  return permissions.some((permission) => hasPermission(role, permission));
}

/**
 * Check if a role has all of the specified permissions
 */
export function hasAllPermissions(role: UserRole, permissions: Permission[]): boolean {
  return permissions.every((permission) => hasPermission(role, permission));
}

/**
 * Resource ownership check
 */
export interface ResourceOwnership {
  createdBy?: string;
  userId?: string;
}

/**
 * Check if user owns a resource or has permission to access it
 */
export function canAccessResource(
  userRole: UserRole,
  userId: string,
  resource: ResourceOwnership,
  permission: Permission
): boolean {
  // Check if user has the permission
  if (!hasPermission(userRole, permission)) {
    return false;
  }

  // If resource has ownership, check if user owns it or is admin
  if (resource.createdBy || resource.userId) {
    const ownerId = resource.createdBy || resource.userId;
    return ownerId === userId || userRole === UserRole.ADMIN;
  }

  // No ownership restriction
  return true;
}
