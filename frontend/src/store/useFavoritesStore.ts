import { create } from 'zustand'

interface FavoritesState {
  ids: Set<number>
  setIds: (ids: number[]) => void
  add: (id: number) => void
  remove: (id: number) => void
  has: (id: number) => boolean
  clear: () => void
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  ids: new Set<number>(),
  setIds: (ids) => set({ ids: new Set(ids) }),
  add: (id) => set((s) => {
    const next = new Set(s.ids)
    next.add(id)
    return { ids: next }
  }),
  remove: (id) => set((s) => {
    const next = new Set(s.ids)
    next.delete(id)
    return { ids: next }
  }),
  has: (id) => get().ids.has(id),
  clear: () => set({ ids: new Set() }),
}))
