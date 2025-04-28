import type {
  BackupScheduleRequest,
  ChangeOrUpdateSecurityGroupDto,
  CreateBackupRequest,
  CreateClusterConfigurationRequest,
  CreateClusterDto,
  CreateDatabaseRequest,
  CreateDatabaseUserRequest,
  CreateOrUpdateSecurityGroupDto,
  CreateWorkspaceDto,
  InviteUserDto,
  LoginDto,
  LoginResponseDto,
  RecoveryFromBackupRequest,
  ResponseBackup,
  ResponseCluster,
  ResponseClusters,
  ResponseDatabase,
  ResponseDatabases,
  ResponseInvite,
  ResponseSecurityGroup,
  ResponseSecurityGroups,
  ResponseUsers,
  WorkspaceData,
  ResponseWorkspaces,
  SignupDto,
  ClusterConfiguration,
  ResponseClusterUsers,
  ResposeReadiness,
  ResponseDashboard,
  ResponseTopQueries,
  DeadlockStat,
  ReplicationSettingsRequest,
  WorkspaceUserMe,
} from '@/types/api';
import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

type RequestParams = Record<string, unknown>;
type RequestBody = Record<string, unknown>;

const apiClient: AxiosInstance = axios.create({
  baseURL: 'http://api.pgaas.ru',
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (
    token &&
    config.url &&
    !config.url.includes('/auth/login') &&
    !config.url.includes('/auth/signup')
  ) {
    if (!config.headers) {
      config.headers = new axios.AxiosHeaders();
    }

    config.headers.set('Authorization', `Bearer ${token}`);
  }

  return config;
});

const request = async <T>(
  method: 'get' | 'post' | 'delete',
  url: string,
  params?: RequestParams,
  data?: RequestBody,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> => {
  const response = await apiClient.request<T>({
    method,
    url,
    params,
    data,
    ...config,
  });
  return response;
};

// === Auth ===

export const loginRequest = async (loginData: LoginDto): Promise<LoginResponseDto> => {
  const response = await request<LoginResponseDto>(
    'post',
    '/auth/login',
    {},
    loginData as unknown as RequestBody,
  );
  return response.data;
};

export const signupRequest = async (signupData: SignupDto): Promise<LoginResponseDto> => {
  const response = await request<LoginResponseDto>(
    'post',
    '/auth/signup',
    {},
    signupData as unknown as RequestBody,
  );
  return response.data;
};

// === Backups ===

export const getBackup = async (
  workspaceId: number,
  clusterId: number,
): Promise<ResponseBackup> => {
  const response = await request<ResponseBackup>(
    'get',
    `/workspace/${workspaceId}/cluster/${clusterId}/backup`,
  );
  return response.data;
};

export const createBackup = async (
  workspaceId: number,
  clusterId: number,
  backupData: CreateBackupRequest,
): Promise<ResponseBackup> => {
  const response = await request<ResponseBackup>(
    'post',
    `/workspace/${workspaceId}/cluster/${clusterId}/backup`,
    {},
    backupData as unknown as RequestBody,
  );
  return response.data;
};

export const scheduleBackup = async (
  workspaceId: number,
  clusterId: number,
  scheduleData: BackupScheduleRequest,
): Promise<ResponseBackup> => {
  const response = await request<ResponseBackup>(
    'post',
    `/workspace/${workspaceId}/cluster/${clusterId}/backup/schedule`,
    {},
    scheduleData as unknown as RequestBody,
  );
  return response.data;
};

export const recoverFromBackup = async (
  workspaceId: number,
  clusterId: number,
  recoveryData: RecoveryFromBackupRequest,
): Promise<ResponseBackup> => {
  const response = await request<ResponseBackup>(
    'post',
    `/workspace/${workspaceId}/cluster/${clusterId}/backup/recovery`,
    {},
    recoveryData as unknown as RequestBody,
  );
  return response.data;
};

// === Cluster ===

export const createCluster = async (
  workspaceId: number,
  clusterData: CreateClusterDto,
): Promise<ResponseCluster> => {
  const response = await request<ResponseCluster>(
    'post',
    `/workspace/${workspaceId}/cluster`,
    {},
    clusterData as unknown as RequestBody,
  );
  return response.data;
};

export const getClusters = async (workspaceId: number): Promise<ResponseClusters> => {
  const response = await request<ResponseClusters>('get', `/workspace/${workspaceId}/cluster`);
  return response.data;
};

export const restartCluster = async (
  workspaceId: number,
  clusterId: number,
): Promise<ResponseCluster> => {
  const response = await request<ResponseCluster>(
    'post',
    `/workspace/${workspaceId}/cluster/${clusterId}/restart`,
  );
  return response.data;
};

export const getCluster = async (
  workspaceId: number,
  clusterId: number,
): Promise<ResponseCluster> => {
  const response = await request<ResponseCluster>(
    'get',
    `/workspace/${workspaceId}/cluster/${clusterId}`,
  );
  return response.data;
};

export const deleteCluster = async (workspaceId: number, id: number): Promise<ResponseDatabase> => {
  const response = await request<ResponseDatabase>(
    'delete',
    `/workspace/${workspaceId}/cluster/${id}`,
  );
  return response.data;
};

// ✅ Check if Cluster systemName exists
export const checkClusterNameExists = async (
  workspaceId: number,
  systemName: string,
): Promise<boolean> => {
  const response = await request<{ exists: boolean }>(
    'get',
    `/workspace/${workspaceId}/cluster/${systemName}/exists`,
  );
  return response.data.exists;
};

// === Databases ===

export const createDatabase = async (
  workspaceId: number,
  clusterId: number,
  databaseData: CreateDatabaseRequest,
): Promise<ResponseDatabase> => {
  const response = await request<ResponseDatabase>(
    'post',
    `/workspace/${workspaceId}/cluster/${clusterId}/database`,
    {},
    databaseData as unknown as RequestBody,
  );
  return response.data;
};

export const getDatabases = async (
  workspaceId: number,
  clusterId: number,
): Promise<ResponseDatabases> => {
  const response = await request<ResponseDatabases>(
    'get',
    `/workspace/${workspaceId}/cluster/${clusterId}/databases`,
  );
  return response.data;
};

export const deleteDatabase = async (
  workspaceId: number,
  clusterId: number,
  databaseName: string,
): Promise<ResponseDatabase> => {
  const response = await request<ResponseDatabase>(
    'delete',
    `/workspace/${workspaceId}/cluster/${clusterId}/database/${databaseName}`,
  );
  return response.data;
};

// === Database Users ===

export const createDatabaseUser = async (
  workspaceId: number,
  clusterId: number,
  databaseData: CreateDatabaseUserRequest,
): Promise<ResponseDatabase> => {
  const response = await request<ResponseDatabase>(
    'post',
    `/workspace/${workspaceId}/cluster/${clusterId}/user`,
    {},
    databaseData as unknown as RequestBody,
  );
  return response.data;
};

export const getDatabasesUsers = async (
  workspaceId: number,
  clusterId: number,
): Promise<ResponseClusterUsers> => {
  const response = await request<ResponseClusterUsers>(
    'get',
    `/workspace/${workspaceId}/cluster/${clusterId}/users`,
  );
  return response.data;
};

export const getDatabasesRoles = async (
  workspaceId: number,
  clusterId: number,
): Promise<ResponseDatabases> => {
  const response = await request<ResponseDatabases>(
    'get',
    `/workspace/${workspaceId}/cluster/${clusterId}/roles`,
  );
  return response.data;
};

export const deleteDatabaseUser = async (
  workspaceId: number,
  clusterId: number,
  username: string,
): Promise<ResponseDatabase> => {
  const response = await request<ResponseDatabase>(
    'delete',
    `/workspace/${workspaceId}/cluster/${clusterId}/user/${username}`,
  );
  return response.data;
};

// === Cluster Configuration ===

export const getClusterConfiguration = async (
  workspaceId: number,
  clusterId: number,
): Promise<ClusterConfiguration> => {
  const response = await request<ClusterConfiguration>(
    'get',
    `/workspace/${workspaceId}/cluster/${clusterId}/configuration`,
  );
  return response.data;
};

export const createClusterConfiguration = async (
  workspaceId: number,
  clusterId: number,
  databaseData: CreateClusterConfigurationRequest,
): Promise<ResponseDatabase> => {
  const response = await request<ResponseDatabase>(
    'post',
    `/workspace/${workspaceId}/cluster/${clusterId}/configuration`,
    {},
    databaseData as unknown as RequestBody,
  );
  return response.data;
};

export const getClusterConfigurationReadiness = async (
  workspaceId: number,
  clusterId: number,
): Promise<ResposeReadiness> => {
  const response = await request<ResposeReadiness>(
    'get',
    `/workspace/${workspaceId}/cluster/${clusterId}/configuration/readiness`,
  );
  return response.data;
};

export const getMonitoringDashboard = async (
  workspaceId: number,
  clusterId: number,
): Promise<ResponseDashboard> => {
  const response = await request<ResponseDashboard>(
    'get',
    `/workspace/${workspaceId}/cluster/${clusterId}/monitoring/dashboard`,
  );
  return response.data;
};
// utils/api.ts
export const getMonitoringTopQueries = async (
  workspaceId: number,
  clusterId: number,
): Promise<ResponseTopQueries> => {
  const response = await request<ResponseTopQueries>(
    'get',
    `/workspace/${workspaceId}/cluster/${clusterId}/monitoring/top-queries`,
  );
  return response.data;
};
export const getMonitoringDeadlocks = async (
  workspaceId: number,
  clusterId: number,
): Promise<DeadlockStat[]> => {
  const response = await request<DeadlockStat[]>(
    'get',
    `/workspace/${workspaceId}/cluster/${clusterId}/monitoring/deadlocks`,
  );
  return response.data;
};
// === Security Groups ===

export const createSecurityGroup = async (
  workspaceId: number,
  securityGroupData: CreateOrUpdateSecurityGroupDto,
): Promise<ResponseSecurityGroup> => {
  const response = await request<ResponseSecurityGroup>(
    'post',
    `/workspace/${workspaceId}/sg`,
    {},
    securityGroupData as unknown as RequestBody,
  );
  return response.data;
};
export const changeSecurityGroup = async (
  workspaceId: number,
  securityGroupData: ChangeOrUpdateSecurityGroupDto,
): Promise<ResponseSecurityGroup> => {
  const response = await request<ResponseSecurityGroup>(
    'post',
    `/workspace/${workspaceId}/sg`,
    {},
    securityGroupData as unknown as RequestBody,
  );
  return response.data;
};

export const getSecurityGroups = async (workspaceId: number): Promise<ResponseSecurityGroups> => {
  const response = await request<ResponseSecurityGroups>('get', `/workspace/${workspaceId}/sg`);
  return response.data;
};

export const deleteSecurityGroup = async (
  workspaceId: number,
  securityGroupId: number,
): Promise<ResponseSecurityGroup> => {
  const response = await request<ResponseSecurityGroup>(
    'delete',
    `/workspace/${workspaceId}/sg/${securityGroupId}`,
  );
  return response.data;
};

// === Workspace ===

export const createWorkspace = async (
  workspaceData: CreateWorkspaceDto,
): Promise<WorkspaceData> => {
  const response = await request<WorkspaceData>(
    'post',
    '/workspaces',
    {},
    workspaceData as unknown as RequestBody,
  );
  return response.data;
};

export const getWorkspaces = async (): Promise<ResponseWorkspaces> => {
  const response = await request<ResponseWorkspaces>('get', '/workspaces');
  return response.data;
};

export const getWorkspace = async (workspaceId: number): Promise<WorkspaceData> => {
  const response = await request<WorkspaceData>('get', `/workspaces/${workspaceId}`);
  return response.data;
};

export const inviteUserToWorkspace = async (
  workspaceId: number,
  inviteData: InviteUserDto,
): Promise<ResponseInvite> => {
  const response = await request<ResponseInvite>(
    'post',
    `/workspaces/${workspaceId}/invite`,
    {},
    inviteData as unknown as RequestBody,
  );
  return response.data;
};

export const getWorkspaceUsers = async (workspaceId: number): Promise<ResponseUsers> => {
  const response = await request<ResponseUsers>('get', `/workspaces/${workspaceId}/users`);
  return response.data;
};

export const getReplicationHosts = async (
  workspaceId: number,
  clusterId: number,
): Promise<string[]> => {
  const response = await request<string[]>(
    'get',
    `/workspace/${workspaceId}/cluster/${clusterId}/replication/hosts`,
  );
  return response.data;
};
export const postReplicationHosts = async (
  workspaceId: number,
  clusterId: number,
): Promise<void> => {
  await request<void>('post', `/workspace/${workspaceId}/cluster/${clusterId}/replication/hosts`);
};
export const deleteReplicationHosts = async (
  workspaceId: number,
  clusterId: number,
): Promise<void> => {
  await request<void>('delete', `/workspace/${workspaceId}/cluster/${clusterId}/replication/hosts`);
};

export const updateReplicationSettings = async (
  workspaceId: number,
  clusterId: number,
  settings: ReplicationSettingsRequest,
): Promise<void> => {
  await request<void>(
    'post',
    `/workspace/${workspaceId}/cluster/${clusterId}/replication/settings`,
    {},
    settings as unknown as RequestBody,
  );
};

export const getCurrentUser = async (workspaceId: number): Promise<WorkspaceUserMe> => {
  const response = await request<WorkspaceUserMe>('get', `/workspaces/${workspaceId}/users/me`);
  return response.data;
};
