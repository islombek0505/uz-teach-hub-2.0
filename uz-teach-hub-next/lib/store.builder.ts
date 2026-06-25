import { create, StateCreator } from "zustand"

/**
 * buildStore — compose several independent "slices" into one Zustand store.
 *
 * Ported from clone-app1. Use it when a single screen needs several pieces of
 * cross-cutting state (e.g. dashboard = stats + filters + ui) without making
 * one giant store definition. Each slice stays small and testable.
 *
 *   type DashboardStore = StatsSlice & FiltersSlice
 *   export const useDashboardStore = buildStore<DashboardStore>([
 *     createStatsSlice,
 *     createFiltersSlice,
 *   ])
 */

type Slice<T> = StateCreator<T, [], [], Partial<T>>

export function buildStore<T>(slices: Slice<T>[]) {
  return create<T>()((...args) => ({
    ...slices.reduce(
      (acc, slice) => ({
        ...acc,
        ...slice(...args),
      }),
      {} as T
    ),
  }))
}
