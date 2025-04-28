export interface User {
  id: number;
  email: string;
  role: number;
}
export interface ClusterUser {
  username: string;
  roles: string[];
  expiryDate: string | null;
}

export interface CreateDatabaseUser {
  username: string;
  password: string;
  database: string;
  roles: string[];
  expiryDate: string; // ISO 8601 формат даты-времени
}

export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  VIEWER = 'viewer',
}

export interface Cluster {
  name: string;
}

export interface SecurityGroup {
  name: string;
  id: number;
}

export interface currentUser {
  role: string;
  workspace: string;
  cluster: string;
}
export const roleMap: Record<string, number> = {
  Viewer: 0,
  Editor: 1,
  Admin: 2,
};
export const roles = [
  { label: 'Admin', value: 'Admin' },
  { label: 'Editor', value: 'Editor' },
  { label: 'Viewer', value: 'Viewer' },
];
