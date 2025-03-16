import { SpacePage, TypeModule, type Module } from '@/types/components';
import { defineStore } from 'pinia';

export const useRenderStore = defineStore('render', {
  state: () => ({
    // centerModule: {
    //   type: TypeModule.Space,
    //   isActive: true,
    //   location: 4,
    //   spacePage: SpacePage.Clusters,
    //   cluster: { name: 'first' },
    // } as Module | null,
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
  }),
  actions: {},
});
