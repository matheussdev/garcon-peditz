export interface IngredientTransactionModalProps {
  open: boolean;
  onCloseModal:()=>void
  onSave:()=>void
  ingredient?: string
  pointOfSale?: string
}
