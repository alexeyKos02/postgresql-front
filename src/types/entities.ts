export interface User {
  id: number;
  email: string;
  role: number;
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
