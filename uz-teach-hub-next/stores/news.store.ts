import { ICreateNews, INews, IUpdateNews } from "@/types"
import { createStoreCreator } from "./store.creator"

export const useNewsStore = createStoreCreator<INews, ICreateNews, IUpdateNews>({
  table: "news",
  orderBy: { column: "published_at", ascending: false },
})
