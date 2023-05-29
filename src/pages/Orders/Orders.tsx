import { useEffect, useState, useContext } from "react";
import { produce } from "immer";

import { Box, Heading, Text, Grid, Flex, Image, Icon } from "@chakra-ui/react";

import MoveCardContext from "../../contexts/moveCard";
import OrderContext from "../../contexts/setOrders";
import api from "../../services/api";

import { StatusCards } from "../../components/StatusCards";
import { ColumnsOrdersSection } from "../../components/ColumnsOrdersSection";

import { ColumnType } from "../../utils/enums";
import { StatusOrderColumn } from "../../components/StatusOrderColumn";

export interface IPointOfSaleResponse {
  id: string;
  name: string;
}

export interface ICommandResponse {
  comandaCode: string;
  id: string;
  table: string;
  phone: string;
  name: string;
}

export interface ICategoryResponse {
  id: string;
  title: string;
}

export interface ItensResponse {
  id: string;
  title: string;
  price: number;
  amount: number;
}

export interface IComplementResponse {
  id: string;
  title: string;
  formula: string;
  type: string;
  itens: ItensResponse[];
}

export interface IProductResponse {
  id: string;
  name: string;
  price: number;
  amount: number;
  obs: string;
  category: ICategoryResponse;
  complement: IComplementResponse[];
}

export interface IOrderProps {
  id: string;
  pointOfSaleId?: IPointOfSaleResponse;
  command: ICommandResponse;
  status: string;
  delivery?: boolean;
  obs: string;
  products: IProductResponse[];
  columnStatus?: string;
}

const mockados: IOrderProps[] = [
  { 
    id: "abc123",
    pointOfSaleId: {
      id: "d783fec6-f250-4687-bc9b-e7dbe613e66f",
      name: "Principal",
    },
    command: {
      comandaCode: "string",
      id: "123456786543",
      table: "10",
      phone: "21988556699",
      name: "José Affonso",
    },
    status: "Pendente",
    delivery: false,
    obs: "Uma singela observação",
    products: [
      {
        id: "699ea494-914b-4af1-a4ed-ecf4f1c1a6ef",
        name: "Caponata de beringela",
        price: 0,
        amount: 1,
        category: {
          id: "3111a742-8577-41a8-8ab3-811771ee8c40",
          title: "Entradas",
        },
        obs: "",
        complement: [
          {
            id: "da5b20f5-9428-4952-854c-5b5bf7e16574",
            title: "Tamanho",
            formula: "Maior",
            type: "CheckBox",
            itens: [
              {
                id: "2537a104-86ed-4b66-b171-1e17521379fc",
                title: "pequeno",
                price: 35.9,
                amount: 1,
              },
            ],
          },
          {
            id: "172d6c2c-94e5-44fd-9826-3bb487f142fb",
            title: "Sabor",
            formula: "Maior",
            type: "CheckBox",
            itens: [
              {
                id: "87abd162-29fb-4d65-b839-acee7b849a09",
                title: "Queijo",
                price: 0,
                amount: 1,
              },
            ],
          },
          {
            id: "4110e72c-201e-4c51-8c25-9d304a477f95",
            title: "adicionais",
            formula: "Soma",
            type: "Increment",
            itens: [
              {
                id: "8325a376-b607-44ad-a765-2bfe4e5a949b",
                title: "bacon",
                price: 1,
                amount: 2,
              },
              {
                id: "3b7d2a22-8413-4370-af03-110cbe484a07",
                title: "cebola",
                price: 0.5,
                amount: 1,
              },
              {
                id: "0afd2346-3e25-4938-ae29-8feeb6dc0a47",
                title: "cheddar",
                price: 2,
                amount: 2,
              },
              {
                id: "a921f477-aa66-4eff-8117-2fad70f55407",
                title: "presunto",
                price: 0,
                amount: 1,
              },
            ],
          },
        ],
      },
    ],
  },
];

export function Orders() {
  // const { orders, setOrders } = useContext(OrderContext);
  const [orders, setOrders] = useState(mockados);
  const [statusColumns, setStatusColumns] = useState([
    "Pendente",
    "Preparando",
    "Pronto",
    "Saiu para Entrega",
  ]);

  useEffect(() => {
    // Ao fazer a requisição,
    // pode filtrar somente os status dos produtos no estado 'status'
    
  }, [orders]);

  return (
    <OrderContext.Provider value={{orders, setOrders, statusColumns, setStatusColumns}}>
      {orders[0] == null ? (
        <Box
          w={"100%"}
          border="3px"
          borderColor="gray.300"
          p={6}
          alignItems="center"
          display="flex"
          borderStyle="dashed"
          flexDir="column"
          borderRadius="xl"
        >
          <Heading as="h5" size="md" color="gray.400" textAlign="center">
            Você ainda não possui nenhum pedido!
          </Heading>
          <Text textAlign="center" color="gray.400" mt={2}>
            Divulgue seu link para receber seus pedidos
          </Text>
        </Box>
      ) : (
        <Flex flexDirection={"column"} justifyContent={"flex-start"} >
          <StatusCards />
          <Grid gap={1} pt={"50px"}  pl={"20px"} pr={"20px"}>
            <Flex justify={"space-evenly"} mb="6" mt={"-80px"} p={0}>
              {statusColumns.map((stat, index) => {
                return <StatusOrderColumn status={stat} key={index} />;
              })}
              {/* <StatusOrderColumn column={ColumnType.PENDING} />
              <StatusOrderColumn column={ColumnType.PRAPARING} />
              <StatusOrderColumn column={ColumnType.DONE} />
              <StatusOrderColumn column={ColumnType.DELIVERED} /> */}
            </Flex>
          </Grid>
        </Flex>
      )}
    </OrderContext.Provider>
  );
}
