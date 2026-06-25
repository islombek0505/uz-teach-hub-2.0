import { ICreatePlan, IPlan, IUpdatePlan } from "@/types"
import { createStoreCreator } from "./store.creator"

export const usePlansStore = createStoreCreator<IPlan, ICreatePlan, IUpdatePlan>({
  table: "plans",
  orderBy: { column: "sort_order", ascending: true },
})
