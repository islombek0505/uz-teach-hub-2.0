import { ICreateNotification, INotification } from "@/types"
import { createStoreCreator } from "./store.creator"

export const useNotificationsStore = createStoreCreator<
  INotification,
  ICreateNotification,
  Partial<INotification>
>({
  table: "notifications",
  orderBy: { column: "created_at", ascending: false },
})
