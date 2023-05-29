import { useCallback } from "react";

import { ColumnType } from "../utils/enums";
import { OrderModel } from "../utils/models";

import useOrderCollection from "./useOrderCollection";

function useColumnOrders(column: ColumnType) {
  const [orders, setOrders] = useOrderCollection();

  const columnOrders = orders[column];

  const addOrder = useCallback((newOrder: OrderModel) => {
    
    setOrders((allOrders) => {
      const columnOrders = allOrders[column];
      // if (columnTasks.length > MAX_TASK_PER_COLUMN) {
      //   debug('Too many task!');
      //   return allTasks;
      // }
      
      const newColumnOrder: OrderModel = {
        id: 0,
        customer: `New ${column} order`,
        origin: "new origin",
        phone: 123,
        price: 22,
        status: column,
        column,
      };
      // ...allTasks,
      // [column]: columnTasks.map((task) =>
      //   task.id === id ? { ...task, ...updatedTask } : task
      console.log(allOrders)
      return {
        ...allOrders,
        [column]: [newOrder, ...columnOrders],
      };
    });
  }, [column, setOrders]);

  const dropOrderFrom = useCallback(
    (from: ColumnType, id: OrderModel['id']) => {
      setOrders((allOrders) => {
        const fromColumnOrders = allOrders[from];
        const toColumnOrders = allOrders[column];
        const movingOrder = fromColumnOrders.find((order) => order.id === id);
        // console.log(toColumnOrders)
        // console.log(fromColumnOrders)
        // console.log("And this is the ID " + id)
        console.log(
          `Moving order ${movingOrder?.id} from ${from} to ${column}`,
        );

        if (!movingOrder) {
          return allOrders;
        }

        // remove the Order from the original column and copy it within the destination column
        return {
          ...allOrders,
          [from]: fromColumnOrders.filter((order) => order.id !== id),
          [column]: [{ ...movingOrder, column }, ...toColumnOrders],
        };
      });
    },
    [column, setOrders],
  );

  return {
    columnOrders,
    addOrder,
    dropOrderFrom,
  };
}

export default useColumnOrders;