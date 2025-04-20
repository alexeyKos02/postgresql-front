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
