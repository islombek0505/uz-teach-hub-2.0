import { ICreatePaymentCard, IPaymentCard } from "@/types"
import { createStoreCreator } from "./store.creator"

export const usePaymentCardsStore = createStoreCreator<
  IPaymentCard,
  ICreatePaymentCard,
  Partial<IPaymentCard>
>({
  table: "payment_cards",
  orderBy: { column: "sort_order", ascending: true },
})
