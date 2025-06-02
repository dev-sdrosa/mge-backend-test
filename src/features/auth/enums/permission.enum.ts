export enum PermissionEnum {
  // Special Permissions
  SYSTEM_ADMIN = 'system_admin',
  PROFILE_VIEW = 'profile:view',

  // Transfers Resource
  TRANSFERS_CREATE = 'transfers:create',
  TRANSFERS_READ = 'transfers:read',
  TRANSFERS_UPDATE = 'transfers:update',
  TRANSFERS_DELETE = 'transfers:delete',

  // Vehicles Resource
  VEHICLES_CREATE = 'vehicles:create',
  VEHICLES_READ = 'vehicles:read',
  VEHICLES_UPDATE = 'vehicles:update',
  VEHICLES_DELETE = 'vehicles:delete',

  // Projects Resource
  PROJECTS_CREATE = 'projects:create',
  PROJECTS_READ = 'projects:read',
  PROJECTS_UPDATE = 'projects:update',
  PROJECTS_DELETE = 'projects:delete',

  // Organizational Units Resource
  ORGANIZATIONALUNITS_CREATE = 'organizationalunits:create',
  ORGANIZATIONALUNITS_READ = 'organizationalunits:read',
  ORGANIZATIONALUNITS_UPDATE = 'organizationalunits:update',
  ORGANIZATIONALUNITS_DELETE = 'organizationalunits:delete',

  // Users Resource
  USERS_CREATE = 'users:create',
  USERS_READ = 'users:read',
  USERS_UPDATE = 'users:update',
  USERS_DELETE = 'users:delete',
  USERS_ASSIGN_ROLE = 'users:assign_role', // Example custom action

  // Roles Resource
  ROLES_CREATE = 'roles:create',
  ROLES_READ = 'roles:read',
  ROLES_UPDATE = 'roles:update',
  ROLES_DELETE = 'roles:delete',

  // Permissions Resource
  PERMISSIONS_CREATE = 'permissions:create',
  PERMISSIONS_READ = 'permissions:read',
  PERMISSIONS_UPDATE = 'permissions:update',
  PERMISSIONS_DELETE = 'permissions:delete',
}