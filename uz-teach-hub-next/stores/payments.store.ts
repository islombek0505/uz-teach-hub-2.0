import { ICreatePayment, IPayment } from "@/types"
import { createStoreCreator } from "./store.creator"

/** Payments — admin reviews these; row carries payer + plan/course refs. */
export const usePaymentsStore = createStoreCreator<IPayment, ICreatePayment, Partial<IPayment>>({
  table: "payments",
  orderBy: { column: "created_at", ascending: false },
})
