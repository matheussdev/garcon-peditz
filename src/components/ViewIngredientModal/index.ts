export interface Ingredient {
  id: string,
  title: string,
  minimumStock: number,
  ean: string,
  stocks?: Stocks[],
  unitMeasure?: UnitMeasure,
}

export interface Stocks {
  id: string,
  minimumStock: number,
  stock: number,
  pointOfSale: PointOfSale;
}
export interface PointOfSale {
  id: string,
  name:string
}

export interface UnitMeasure {
  id:string,
  unit:string,
}

export interface ViewIngredientModalProps {
  open: boolean;
  onCloseModal:()=>void
  ingredient: Ingredient;
  selectedIngredientId: string;
}