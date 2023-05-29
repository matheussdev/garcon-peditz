import { useContext } from "react";

import { Grid, Flex } from "@chakra-ui/react";

import { ColumnType } from "../../utils/enums";
import { IOrderProps } from "../../pages/Orders/Orders";
import { StatusOrderColumn } from "../StatusOrderColumn";

import MoveCardContext from "../../contexts/moveCard";
import { useColumnDrop } from "../../hooks/useColumnDrop";
import useColumnOrders from "../../hooks/useColumnOrder";

interface IColumnsProps {
  status: string[];
  orders: IOrderProps[];
}

export function ColumnsOrdersSection({ column }: { column: ColumnType }) {
  const { status, orders } = useContext(MoveCardContext);

  const { dropOrderFrom } = useColumnOrders(column);

  const { dropRef, isOver } = useColumnDrop(column, dropOrderFrom);

  return (
    <Grid gap={10} padding={"50px"}>
      <Flex
        justify={"space-between"}
        mb="6"
        mt={"-80px"}
        ref={dropRef}
        opacity={isOver ? 0.85 : 1}
      >

      </Flex>
    </Grid>
  );
}

// {status.map((st, index) => {
//   const filteredOrders = orders.filter((order: IOrderProps) => {
//     return order.status === st;
//   });
//   return (
//     <StatusOrderColumn
//       title={st}
//       orders={filteredOrders}
//       key={index}
//       listIndex={index}
//     /> 
//     <></>
//   );
// })}