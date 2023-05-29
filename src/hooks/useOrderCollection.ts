import { useLocalStorage } from "usehooks-ts";

import { ColumnType } from "../utils/enums";
import { OrderModel } from "../utils/models";

function useOrderCollection() {
  return useLocalStorage<{
    [key in ColumnType]: OrderModel[];
  }>('orders', {
    Pendente: [
      {
        id: 10,
        customer: "Custumer do pending",
        phone: 21999998888,
        price: 25.9,
        origin: "Peditz",
        status: ColumnType.PENDING,
        column: ColumnType.PENDING,
      },
    ],
    Preparando: [
      {
        id: 20,
        customer: "Custumer do preparing",
        phone: 21999998888,
        price: 25.9,
        origin: "Peditz",
        status: ColumnType.PRAPARING,
        column: ColumnType.PRAPARING,
      },
    ],
    Pronto: [
      {
        id: 22,
        customer: "Custumer do done",
        phone: 21999998888,
        price: 25.9,
        origin: "Peditz",
        status: ColumnType.DONE,
        column: ColumnType.DONE,
      },
    ],
    "Saiu para Entrega": [
      {
        id: 13,
        customer: "Custumer do delivering",
        phone: 21999998888,
        price: 25.9,
        origin: "Peditz",
        status: ColumnType.DELIVERED,
        column: ColumnType.DELIVERED,
      },
    ],
  });
}

export default useOrderCollection;
