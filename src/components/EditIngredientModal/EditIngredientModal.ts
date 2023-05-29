export interface Ingredient {
  id: string,
  title: string,
  minimumStock: string,
  ean: string,
  unitMeasure: string
}

export interface Unities {
  id: string;
  unit: string;
}

export interface EditIngredientModalProps {
  open: boolean;
  onSave: () => void;
  onCloseModal:()=>void
  ingredient: Ingredient;
  selectedIngredientId: string;
}