import { useContext, useState, useEffect } from "react";
import { Box, Heading } from "@chakra-ui/react";

import api from "../../services/api";

import { OrderCard } from "../OrderCard";
import { IOrderProps } from "../../pages/Orders/Orders";

import MoveCardContext from "../../contexts/moveCard";
import OrderContext from "../../contexts/setOrders";

import { ColumnType } from "../../utils/enums";
import useColumnOrders from "../../hooks/useColumnOrder";
import { useColumnDrop } from "../../hooks/useColumnDrop";

import "./styles.css";

interface IColumnsProps {
  status: string;
  // orders: IOrderProps[];
  // listIndex: number;
}

// const mockedOrders: IOrderProps[] = [
//   {
//     id: 10,
//     customer: "josé bonifácio",
//     phone: 21999998888,
//     price: 25.9,
//     origin: "Peditz",
//     status: ColumnType.PRAPARING,
//   },
//   {
//     id: 11,
//     customer: "josé bonifácio 2",
//     phone: 21999998888,
//     price: 105.9,
//     origin: "Peditz",
//     status: ColumnType.PENDING,
//   },
//   {
//     id: 12,
//     customer: "josé bonifácio 3",
//     phone: 21999998888,
//     price: 105.9,
//     origin: "Peditz",
//     status: ColumnType.DELIVERED,
//   },
//   {
//     id: 13,
//     customer: "josé bonifácio 4",
//     phone: 21999998888,
//     price: 105.9,
//     origin: "Peditz",
//     status: ColumnType.DONE,
//   },
//   {
//     id: 14,
//     customer: "Masques de pombal",
//     phone: 35929098867,
//     price: 15,
//     origin: "Peditz",
//     status: ColumnType.PENDING,
//   },
//   {
//     id: 15,
//     customer: "Masques de pombal 2",
//     phone: 35929098867,
//     price: 15.5,
//     origin: "Peditz",
//     status: ColumnType.PRAPARING,
//   },
//   {
//     id: 16,
//     customer: "Masques de pombal 3",
//     phone: 35929098867,
//     price: 15.5,
//     origin: "Peditz",
//     status: ColumnType.DELIVERED,
//   },
//   {
//     id: 17,
//     customer: "Masques de pombal 4",
//     phone: 35929098867,
//     price: 15.5,
//     origin: "Peditz",
//     status: ColumnType.PRAPARING,
//   },
//   {
//     id: 18,
//     customer: "Tiradentes",
//     phone: 33989898876,
//     price: 50,
//     origin: "Peditz",
//     status: ColumnType.PRAPARING,
//   },
//   {
//     id: 19,
//     customer: "Dom Pedro",
//     phone: 11923458765,
//     price: 27.9,
//     origin: "Peditz",
//     status: ColumnType.PENDING,
//   },
//   {
//     id: 20,
//     customer: "Dom Pedro32",
//     phone: 11923458765,
//     price: 27.9,
//     origin: "Peditz",
//     status: ColumnType.DELIVERED,
//   },
//   {
//     id: 21,
//     customer: "Dom Pedro2",
//     phone: 11923458765,
//     price: 27.9,
//     origin: "Peditz",
//     status: ColumnType.PENDING,
//   },
//   {
//     id: 22,
//     customer: "Dom Pedro3",
//     phone: 11923458765,
//     price: 27.9,
//     origin: "Peditz",
//     status: ColumnType.DONE,
//   },
// ];

// { column }: { column: ColumnType }, Isso nao ta funcionando
export function StatusOrderColumn({ status }: IColumnsProps) {
  const { orders, setOrders, statusColumns, setStatusColumns } =
    useContext(OrderContext);
  const [filteredOrders, setFilteredOrders] = useState<IOrderProps[]>([]);

  function filterOrders() {
    // console.log("Testando se o Order muda de status =>", orders);
    const filter = orders.filter((order: IOrderProps) => {
      return order.status === status;
    });
    if (filter.length > 0) {
      setFilteredOrders(filter);
    }
    // console.log("status atual da coluna =>" + status);
    // console.log("ordens filtradas dessa coluna =>", filteredOrders);
  }

  useEffect(() => {
    filterOrders();
  }, [orders]);

  return (
    <Box
      w={"20%"}
      minW={"250px"}
      minH={"400px"}
      maxH={"500px"}
      h={"106%"}
      bg={"white"}
      borderRadius={"10px"}
      padding={"15px"}
      display={"flex"}
      justifyContent={"flex-start"}
      flexDirection={"column"}
      boxShadow="md"
      gap={4}
      overflow="auto"
      // opacity={isOver ? 0.85 : 1}
      // ref={dropRef}
    >
      <Heading as="h5" size="sm">
        {status}
      </Heading>

      <div className="column-div">
        {filteredOrders.length > 0 &&
          filteredOrders.map((order, index) => {
            return (
              <>
                <OrderCard
                  // key={index}
                  id={order.id}
                  command={order.command}
                  obs={order.obs}
                  status={order.status}
                  products={order.products}
                  columnStatus={status}
                />
              </>
            );
          })}
      </div>
    </Box>
  );
}
