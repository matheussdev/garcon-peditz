export interface IngredientTransactionModalProps {
  open: boolean;
  onCloseModal:()=>void
  onSave:()=>void
  product?: string
  pointOfSale?: string
}
