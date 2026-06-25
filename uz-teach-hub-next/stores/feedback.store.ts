import { ICreateFeedback, IFeedback } from "@/types"
import { createStoreCreator } from "./store.creator"

export const useFeedbackStore = createStoreCreator<IFeedback, ICreateFeedback, Partial<IFeedback>>({
  table: "feedback",
  orderBy: { column: "created_at", ascending: false },
})
