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
  additionalProp1: string;
  additionalProp2: string;
  additionalProp3: string;
}


export interface CreateDatabaseUserRequest {
  username: string;
  password: string;
  database: string;
  roles: string[];
  expiryDate: string;
}

export interface CreateOrUpdateSecurityGroupDto {
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

export interface ResponseBackup {
  api_version: string;
  value: BackupData;
}

export interface ResponseCluster {
  api_version: string;
  value: ClusterData;
}

export interface ResponseDatabase {
  api_version: string;
  value: DatabaseData;
}

export interface ResponselusterConfiguration {
  api_version: string;
  value: DatabaseData;
}

export interface ResponseDatabases {
  api_version: string;
  value: DatabaseData[];
}

export interface ResponseSecurityGroup {
  api_version: string;
  value: SecurityGroupData;
}

export interface ResponseClusters {
  api_version: string;
  value: string;
}

export interface ResponseSecurityGroups {
  api_version: string;
  value: SecurityGroupData[];
}

export interface ResponseInvite {
  api_version: string;
  value: string;
}
export interface ResponseWorkspace {
  api_version: string;
  value: WorkspaceData;
}

export interface ResponseWorkspaces {
  api_version: string;
  value: WorkspaceData[];
}

export interface ResponseUsers {
  api_version: string;
  value: string;
}

export interface RequestBody {
  // Общий тип для тела запроса
}

export interface BackupData {
  // Данные о резервной копии
}

export interface ClusterData {
  // Данные о кластере
}

export interface DatabaseData {
  // Данные о базе данных
}

export interface SecurityGroupData {
  // Данные о группе безопасности
}

export interface WorkspaceData {
  // Данные о рабочем пространстве
}
