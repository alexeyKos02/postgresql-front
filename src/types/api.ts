export interface CreateBackupRequest {
  method: string;
}

export interface BackupScheduleRequest {
  cronExpression: string;
  method: string;
}

export interface RecoveryFromBackupRequest {
  backupName: string;
}

export interface CreateClusterDto {
  systemName: string;
  storageSize: number;
  cpu: number;
  memory: number;
  majorVersion: number;
  databaseName: string;
  lcCollate: string;
  lcCtype: string;
  instances: number;
  ownerName: string;
  ownerPassword: string;
  poolerMode: string;
  poolerMaxConnections: number;
  poolerDefaultPoolSize: number;
  securityGroupId: number;
  backupScheduleCronExpression: string;
  backupMethod: string;
}

export interface CreateDatabaseRequest {
  database: string;
  owner: string;
  lcCollate: string;
  lcCtype: string;
}

export interface CreateClusterConfigurationRequest {
  [key: string]: string;
}

export interface CreateDatabaseUserRequest {
  username: string;
  password: string;
  database: string;
  roles: string[];
  expiryDate: string | null;
}

export interface CreateOrUpdateSecurityGroupDto {
  name: string;
  allowedIps: string[];
}
export interface ChangeOrUpdateSecurityGroupDto {
  id: number;
  name: string;
  allowedIps: string[];
}
export interface CreateWorkspaceDto {
  name: string;
}

export interface InviteUserDto {
  email: string;
  role: number;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  accessToken: string;
}

export interface SignupDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export type ResponseBackup = BackupData[];

export type ResponseCluster = ClusterData;

export interface ResponseDatabase {
  api_version: string;
  value: DatabaseData;
}

export interface ResponselusterConfiguration {
  api_version: string;
  value: DatabaseData;
}

export interface ClusterConfigurationReadiness {
  status: 'waiting' | 'ready';
  failedParameters: string[] | null;
}

export interface ResponseClusterUser {
  username: string;
  roles: string[]; // массив строк, предполагается что роли — это строки
  expiryDate: string | null; // может быть null или строкой (например, ISO-дата)
}

export type ResponseClusterUsers = ResponseClusterUser[];

export type ResponseDatabases = string[];
export type ResposeReadiness = {
  status: 'waiting' | 'failed' | 'success';
  failedParameters: string[] | null;
};
export interface ResponseDashboard {
  link: string;
}

export interface TopQueryStat {
  query: string;
  totalExecTime: number;
  calls: number;
  meanExecTime: number;
  stddevExecTime: number;
  rows: number;
  sharedBlocksHit: number;
  sharedBlocksRead: number;
}

export type ResponseTopQueries = TopQueryStat[];

export interface DeadlockStat {
  database: string;
  deadlockCount: number;
}

export interface ResponseSecurityGroup {
  api_version: string;
  value: SecurityGroupData;
}

export type ResponseClusters = {
  id: number;
  status: number;
  systemName: string;
  securityGroupId: number;
  workspaceId: number;
  storageSize: number;
  cpu: number;
  memory: number;
  majorVersion: number;
  databaseName: string;
  lcCollate: string;
  lcCtype: string;
  instances: number;
  ownerName: string;
  ownerPassword: string;
  poolerMode: string;
  poolerMaxConnections: number;
  poolerDefaultPoolSize: number;
  backupScheduleCronExpression: string;
  backupMethod: string;
  dataDurability: string | null;
  syncReplicas: number | null;
}[];

export type ResponseSecurityGroups = SecurityGroupData[];

export interface ResponseInvite {
  api_version: string;
  value: string;
}
export interface WorkspaceData {
  id: number;
  name: string;
}

export type ResponseWorkspaces = WorkspaceData[];

export type ResponseUsers = Array<{
  id: number;
  email: string;
  role: number;
}>;

export interface RequestBody {
  // Общий тип для тела запроса
}

export interface BackupData {
  status: {
    backupId: string;
    backupName: string;
    backupLabelFile?: string;
    beginLSN?: string;
    beginWal?: string;
    endLSN?: string;
    endWal?: string;
    error?: string;
    instanceID: {
      ContainerID: string;
      podName: string;
    };
    method: string;
    online?: boolean;
    phase: 'failed' | 'completed' | string;
    snapshotBackupStatus?: {
      elements: {
        name: string;
        type: string;
      }[];
    };
    startedAt: string;
    stoppedAt?: string;
  };
}

export interface ClusterData {
  id: number;
  status: number;
  systemName: string;
  securityGroupId: number;
  workspaceId: number;
  storageSize: number;
  cpu: number;
  memory: number;
  majorVersion: number;
  databaseName: string;
  lcCollate: string;
  lcCtype: string;
  instances: number;
  ownerName: string;
  backupMethod: string;
  backupScheduleCronExpression: string;
  poolerMode: string;
  poolerMaxConnections: number;
  poolerDefaultPoolSize: number;
  dataDurability: string | null;
  syncReplicas: number | null;
}

export interface DatabaseData {
  // Данные о базе данных
}

export type ClusterConfiguration = ClusterConfigurationItem[];

export type ClusterConfigurationItem = {
  name: string;
  type: 'text' | 'bool' | 'select';
  options: string[] | null;
  value: string | null;
};

export interface SecurityGroupData {
  id: number;
  workspaceId: number;
  name: string;
  allowedIps: string[];
}

export interface ReplicationSettingsRequest {
  syncReplicas: number;
  dataDurability: string;
}
