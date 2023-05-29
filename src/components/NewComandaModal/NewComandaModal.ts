interface ITable {
  id: string;
  name: string;
  number: number;
}


export interface IngredientModalProps {
  open: boolean;
  onCloseModal:()=>void
  onSave:()=>void
  posId?: string
  tables: ITable[];
}
