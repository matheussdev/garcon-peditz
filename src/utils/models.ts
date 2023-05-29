import { ColumnType } from "./enums";

export interface OrderModel {
  // mudar depois para string
  id: number;
  customer: string;
  phone: number;
  price: number;
  origin: string;
  status: string;
  column?: ColumnType;
}

export interface DragItem {
  index: number;
  id: OrderModel['id'];
  from: ColumnType;
}
