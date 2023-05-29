import { useRef } from "react";
import { useDrag } from "react-dnd";

import { ItemType } from "../utils/enums";
import { DragItem, OrderModel } from "../utils/models";

export function useOrderDragAndDrop<T extends HTMLElement>({
  order,
  index,
}: {
  order: OrderModel;
  index: number;
}) {
  const ref = useRef<T>(null);

  const [{ isDragging }, drag] = useDrag<
    DragItem,
    void,
    { isDragging: boolean }
  >({
    type: ItemType.ORDER,
    item: { from: order.column!, id: order.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // console.log(order.column)

  drag(ref);

  return {
    ref,
    isDragging,
  };
}
