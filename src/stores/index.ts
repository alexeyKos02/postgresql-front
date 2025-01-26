import { SpacePage, TypeModule, type Module } from '@/types/components'
import { defineStore } from 'pinia'

export const useRenderStore = defineStore('render', {
  state: () => ({
    centerModule: { type: TypeModule.Space, isActive: true } as Module | null,
    centerModuleHistory: [TypeModule.Space] as TypeModule[],
    SpacePage: SpacePage.Clusters as SpacePage,
  }),
  actions: {},
})
