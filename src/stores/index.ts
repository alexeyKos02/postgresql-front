
import type { CreateClusterDto, CreateWorkspaceDto, LoginDto, LoginResponseDto, SignupDto, WorkspaceData } from '@/types/api';
import { SpacePage, TypeModule, type Module } from '@/types/components';
import { createCluster, createWorkspace, getWorkspaces, getWorkspace, loginRequest, signupRequest } from '@/utils/api';
import { defineStore } from 'pinia';

export const useRenderStore = defineStore('render', {
  state: () => ({
    isLoading: false,
    centerModuleHistory: [TypeModule.Space] as TypeModule[],
    modules: [
      {
        type: TypeModule.Space,
        isActive: true,
        location: 0,
        spacePage: SpacePage.Clusters,
        cluster: { name: 'center' },
      },
      {
        type: TypeModule.Space,
        isActive: true,
        location: 1,
        spacePage: SpacePage.Clusters,
        cluster: { name: 'first' },
      },
      {
        type: TypeModule.Space,
        isActive: true,
        location: 2,
        spacePage: SpacePage.Clusters,
        cluster: { name: 'second' },
      },
      {
        type: TypeModule.Space,
        isActive: true,
        location: 3,
        spacePage: SpacePage.Clusters,
        cluster: { name: 'third' },
      },
      {
        type: TypeModule.Space,
        isActive: true,
        location: 4,
        spacePage: SpacePage.Clusters,
        cluster: { name: 'fourth' },
      },
    ] as Module[],
    user: null as LoginResponseDto | null,
    token: localStorage.getItem('token') || null,

    // ✅ Добавляю состояния для workspaces
    workspaces: [] as WorkspaceData[],
    currentWorkspace: null as WorkspaceData | null,
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

    // === CLUSTER ===

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

    // === WORKSPACES ===

    async createWorkspace(workspaceData: CreateWorkspaceDto) {
      try {
        const response = await createWorkspace(workspaceData);
        console.log('Workspace создан:', response);
        this.workspaces.push(response); // добавляем в список
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
        console.log('Workspace загружен:', response.value);
        this.currentWorkspace = response.value;
      } catch (error) {
        console.error('Ошибка при получении workspace:', error);
        throw error;
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
