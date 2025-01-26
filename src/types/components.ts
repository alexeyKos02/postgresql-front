export interface ButtonClass {
  label: string
  action: () => void
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
export interface Module {
  type: TypeModule
  isActive: boolean
}
