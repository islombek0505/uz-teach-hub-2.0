import { IProfile, IUpdateProfile } from "@/types"
import { createStoreCreator } from "./store.creator"

/** Students = profiles table. Admin lists & manages them. */
export const useStudentsStore = createStoreCreator<IProfile, Partial<IProfile>, IUpdateProfile>({
  table: "profiles",
  orderBy: { column: "created_at", ascending: false },
})
