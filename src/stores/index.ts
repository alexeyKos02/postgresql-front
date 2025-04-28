import type {
  CreateClusterDto,
  CreateWorkspaceDto,
  LoginDto,
  LoginResponseDto,
  SignupDto,
  WorkspaceData,
  ClusterData,
} from '@/types/api';
import { SpacePage, TypeModule, type Module } from '@/types/components';
import { roleMap, type currentUser } from '@/types/entities';
import {
  createCluster,
  createWorkspace,
  getWorkspaces,
  getWorkspace,
  getClusters,
  loginRequest,
  signupRequest,
  getCurrentUser,
} from '@/utils/api';
import { defineStore } from 'pinia';

export const useRenderStore = defineStore('render', {
  state: () => ({
    isLoading: false as boolean,
    isFull: true as boolean,

    modules: [
      {
        type: TypeModule.Space,
        isActive: true,
        location: 0,
        spacePage: SpacePage.Clusters,
        cluster: { name: 'first' },
      },
      {
        type: TypeModule.Default,
        isActive: false,
        location: 1,
        spacePage: SpacePage.Clusters,
        cluster: { name: 'second' },
      },
      {
        type: TypeModule.Default,
        isActive: false,
        location: 2,
        spacePage: SpacePage.Clusters,
        cluster: { name: 'third' },
      },
      {
        type: TypeModule.Default,
        isActive: false,
        location: 3,
        spacePage: SpacePage.Clusters,
        cluster: { name: 'fourth' },
      },
    ] as Module[],

    // 💡 Новое поле истории типов модулей
    moduleTypeHistory: [[], [], [], []] as TypeModule[][],

    user: null as LoginResponseDto | null,
    token: localStorage.getItem('token') || null,

    workspaces: [] as WorkspaceData[],
    currentWorkspaces: [{}, {}, {}, {}] as WorkspaceData[],

    clusters: [[], [], [], []] as ClusterData[][],
    singleClusters: [0, 0, 0, 0] as number[],
    currentUserInfoId: 0 as number,
    currentUserInfo: [
      { role: '', workspace: '', cluster: '' },
      { role: '', workspace: '', cluster: '' },
      { role: '', workspace: '', cluster: '' },
      { role: '', workspace: '', cluster: '' },
    ] as currentUser[],
  }),

  actions: {
    // === AUTH ===

    async login(loginData: LoginDto) {
      try {
        const response = await loginRequest(loginData);
        this.user = response;
        this.token = response.accessToken;
        localStorage.setItem('token', response.accessToken);
        console.log('Login successful:', response);
      } catch (error) {
        console.error('Login failed:', error);
        throw error;
      }
    },

    async signup(signupData: SignupDto) {
      try {
        const response = await signupRequest(signupData);
        this.user = response;
        this.token = response.accessToken;
        localStorage.setItem('token', response.accessToken);
        console.log('Signup successful:', response);
      } catch (error) {
        console.error('Signup failed:', error);
        throw error;
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('token');
      console.log('User logged out');
    },

    initialize() {
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        this.token = savedToken;
        console.log('Token found in localStorage:', savedToken);
      }
    },

    // === CLUSTERS ===

    async createCluster(workspaceId: number, clusterData: CreateClusterDto) {
      try {
        const response = await createCluster(workspaceId, clusterData);
        console.log('Кластер успешно создан:', response);
        return response;
      } catch (error) {
        console.error('Ошибка при создании кластера:', error);
        throw error;
      }
    },

    async fetchClusters(workspaceId: number, arrayWorkSpaceId: number) {
      try {
        const response = await getClusters(workspaceId);
        console.log('Кластеры загружены:', response);
        this.clusters[arrayWorkSpaceId] = response;
      } catch (error) {
        console.error('Ошибка при получении кластеров:', error);
        throw error;
      }
    },

    // === WORKSPACES ===

    async createWorkspace(workspaceData: CreateWorkspaceDto) {
      try {
        const response = await createWorkspace(workspaceData);
        console.log('Workspace создан:', response);
        this.workspaces.push(response);
        return response;
      } catch (error) {
        console.error('Ошибка при создании workspace:', error);
        throw error;
      }
    },

    async fetchWorkspaces() {
      try {
        const response = await getWorkspaces();
        console.log('Workspaces загружены:', response);
        this.workspaces = response;
      } catch (error) {
        console.error('Ошибка при получении списка workspaces:', error);
        throw error;
      }
    },

    async fetchWorkspace(workspaceId: number) {
      try {
        const response = await getWorkspace(workspaceId);
        console.log('Workspace загружен:', response);
        return response;
      } catch (error) {
        console.error('Ошибка при получении workspace:', error);
        throw error;
      }
    },

    // === HISTORY ===

    pushModuleTypeToHistory(moduleType: TypeModule, index: number = 0) {
      if (!this.moduleTypeHistory[index]) {
        this.moduleTypeHistory[index] = [];
      }

      const history = this.moduleTypeHistory[index];
      const last = history[history.length - 1];

      if (last !== moduleType) {
        history.push(moduleType);
      }
    },

    async fetchCurrentUserInfo(workspaceId: number, workspaceName: string, moduleId: number) {
      try {
        const response = await getCurrentUser(workspaceId);
        const roleNumber: number = response.role;
        const roleString =
          Object.keys(roleMap).find((key) => roleMap[key] === roleNumber) ?? 'Unknown';

        this.currentUserInfo[moduleId] = {
          role: roleString,
          workspace: workspaceName,
          cluster: '', // Можно дополнить, если будет нужно
        };

        console.log('Информация о текущем пользователе обновлена:', this.currentUserInfo);
      } catch (error) {
        console.error('Ошибка при получении информации о текущем пользователе:', error);
      }
    },
  },
});

// import type { CreateClusterDto, LoginDto, LoginResponseDto, SignupDto } from '@/types/api';
// import { SpacePage, TypeModule, type Module } from '@/types/components';
// import { createCluster, loginRequest, signupRequest } from '@/utils/api';
// import { defineStore } from 'pinia';

// export const useRenderStore = defineStore('render', {
//   state: () => ({
//     // centerModule: {
//     //   type: TypeModule.Space,
//     //   isActive: true,
//     //   location: 4,
//     //   spacePage: SpacePage.Clusters,
//     //   cluster: { name: 'first' },
//     // } as Module | null,
//     centerModuleHistory: [TypeModule.Space] as TypeModule[],
//     modules: [
//       {
//         type: TypeModule.Space,
//         isActive: true,
//         location: 0,
//         spacePage: SpacePage.Clusters,
//         cluster: { name: 'center' },
//       },
//       {
//         type: TypeModule.Space,
//         isActive: true,
//         location: 1,
//         spacePage: SpacePage.Clusters,
//         cluster: { name: 'first' },
//       },
//       {
//         type: TypeModule.Space,
//         isActive: true,
//         location: 2,
//         spacePage: SpacePage.Clusters,
//         cluster: { name: 'second' },
//       },
//       {
//         type: TypeModule.Space,
//         isActive: true,
//         location: 3,
//         spacePage: SpacePage.Clusters,
//         cluster: { name: 'third' },
//       },
//       {
//         type: TypeModule.Space,
//         isActive: true,
//         location: 4,
//         spacePage: SpacePage.Clusters,
//         cluster: { name: 'fourth' },
//       },
//     ] as Module[],
//     user: null as LoginResponseDto | null,
//     token: localStorage.getItem('token') || null,
//   }),
//   actions: {
//     // Login action
//     async login(loginData: LoginDto) {
//       try {
//         const response = await loginRequest(loginData);
//         this.user = response;
//         this.token = response.accessToken; // Сохраняем токен в state
//         localStorage.setItem('token', response.accessToken); // Сохраняем токен в localStorage
//         console.log('Login successful:', response);
//       } catch (error) {
//         console.error('Login failed:', error);
//         throw error;
//       }
//     },

//     // Signup action
//     async signup(signupData: SignupDto) {
//       try {
//         const response = await signupRequest(signupData);
//         this.user = response;
//         this.token = response.accessToken; // Сохраняем токен в state
//         localStorage.setItem('token', response.accessToken); // Сохраняем токен в localStorage
//         console.log('Signup successful:', response);
//       } catch (error) {
//         console.error('Signup failed:', error);
//         throw error;
//       }
//     },
//        // Logout action
//     logout() {
//       this.user = null;
//       this.token = null;
//       localStorage.removeItem('token');
//       console.log('User logged out');
//     },

//     // Init user from token if needed
//     initialize() {
//       const savedToken = localStorage.getItem('token');
//       if (savedToken) {
//         this.token = savedToken;
//         // Тут по-хорошему нужно бы сделать запрос к backend и получить user info по токену
//         console.log('Token found in localStorage:', savedToken);
//         // Пример: await this.fetchUserProfile();
//       }
//     },
//     async createCluster(workspaceId: number, clusterData: CreateClusterDto) {
//       try {
//         const response = await createCluster(workspaceId, clusterData);
//         console.log('Кластер успешно создан:', response);
//         return response; // можно вернуть, если нужно использовать в компоненте
//       } catch (error) {
//         console.error('Ошибка при создании кластера:', error);
//         throw error; // пробрасываем дальше, чтобы ловить в компоненте
//       }
//     },
//   },
// });
