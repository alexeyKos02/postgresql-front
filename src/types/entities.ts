export interface User {
  email: string;
  role: UserRole;
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
  id: string;
}
