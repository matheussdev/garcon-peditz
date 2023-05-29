import { useDrop } from "react-dnd";
import { ColumnType, ItemType } from "../utils/enums";
import { DragItem, OrderModel } from "../utils/models";

export function useColumnDrop(
  column: ColumnType,
  handleDrop: (fromColumn: ColumnType, orderId: OrderModel["id"]) => void,
) {
  const [{ isOver }, dropRef] = useDrop<DragItem, void, { isOver: boolean }>({
    accept: ItemType.ORDER,
    drop: (dragItem) => {
      if (!dragItem || dragItem.from === column) {
        return;
      }

      handleDrop(dragItem.from, dragItem.id);
    },
    collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
  });

  return {
    isOver,
    dropRef,
  };
}
