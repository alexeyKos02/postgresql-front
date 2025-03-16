import type { Cluster } from './entities';

export interface ButtonClass {
  label: string;
  action: () => void;
}

export enum TypeModule {
  CreateCluster = 'CreateCluster',
  ClusterInfo = 'ClusterInfo',
  Space = 'Space',
  AddUser = 'AddUser',
  AddSecurityGroup = 'AddSecurityGroup',
}
export enum SpacePage {
  Clusters = 'Clusters',
  Users = 'Users',
  Security = 'Security',
}
// локации от 1 до 5, где 5 это центральная локация
export interface Module {
  type: TypeModule;
  isActive: boolean;
  location: number;
  spacePage?: SpacePage;
  cluster: Cluster;
}
