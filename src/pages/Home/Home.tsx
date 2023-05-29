import {
  Box,
  Heading,
  Icon,
  Select,
  SimpleGrid,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import { FaConciergeBell } from "react-icons/fa";
import { BsCash, BsPeople, BsPersonCheck } from "react-icons/bs";

import { Card } from "../../components/Card";
import { EmptyBox } from "../../components/EmptyBox";
import { useState, useEffect } from "react";
import api from "../../services/api";
import { logout } from "../../services/auth";
import { currency } from "../../utils/currency";
import { PointOfSale } from "../../types";
import { CharHome } from "../../components/CharHome";
import { CharHomePizza } from "../../components/CharHomePizza";
interface Trasaction {
  createdAt: string;
  formOfPayment: string;
  id: string;
  saleChannel: string;
  total: number;
}
export function Home() {
  const [transactions, setTransactions] = useState<Trasaction[]>([]);
  const [transactionsStock, setTransactionsStock] = useState<any[]>([]);
  const [points, setPoints] = useState<PointOfSale[]>([]);
  const [pointTofilter, setPointToFilter] = useState("");
  const [pointsIsLoading, setPointsIsLoading] = useState(false);
  const [transactionsLoad, setTransactionsLoad] = useState(false);
  function getTransactions(pointId: string) {
    setTransactionsLoad(true);
    api
      .get(`/api/financial-transactions/${pointId}`)
      .then((response) => {
        console.log(response.data);
        setTransactions(response.data);
      })
      .catch((err) => {
        if (err.response.data.statusCode === 401) {
          logout();
        }
      })
      .finally(() => {
        setTransactionsLoad(false);
      });
  }

  useEffect(() => {
    setPointsIsLoading(true);
    api
      .get("/api/point-of-sale")
      .then((response) => {
        setPoints(response.data);
        setPointToFilter(response.data[0].id);
        getTransactions(response.data[0].id);
      })
      .finally(() => {
        setPointsIsLoading(false);
      });
  }, []);
  function getIngredients() {
    api
      .get("/api/transactions/products")
      .then((response) => {
        setTransactionsStock(response.data);
      })
      .catch((err) => {
        if (err.response.data.statusCode === 401) {
          logout();
        }
      })
      .finally(() => {});
  }
  useEffect(() => {
    getIngredients();
  }, []);
  return (
    <>
      <Select
        w={"fit-content"}
        background="white"
        value={pointTofilter}
        mb={4}
        onChange={(e) => {
          setPointToFilter(e.target.value);
        }}
      >
        {/* <option value="">Selecione um ponto de venda</option> */}
        {points.map((x) => (
          <option value={x.id} key={x.id}>
            {x.name}
          </option>
        ))}
      </Select>
      <SimpleGrid minChildWidth={200} gap={4}>
        <Card p={6}>
          <Text
            color={"gray.400"}
            alignItems={"flex-end"}
            display={"flex"}
            mb={2}
          >
            <Icon
              as={FaConciergeBell}
              color={"blue.500"}
              bg={"blue.100"}
              fontSize={"1.8rem"}
              p={1}
              rounded={"md"}
              mr={2}
            />{" "}
            Pedidos Recebidos
          </Text>
          <Heading fontSize={"1.5rem"} color={"blue.500"}>
            0
          </Heading>
        </Card>

        <Card p={6}>
          <Text
            color={"gray.400"}
            alignItems={"flex-end"}
            display={"flex"}
            mb={2}
          >
            <Icon
              as={BsCash}
              color={"green.500"}
              bg={"green.100"}
              fontSize={"1.8rem"}
              p={1}
              rounded={"md"}
              mr={2}
            />
            Receita bruta
          </Text>
          <Heading fontSize={"1.5rem"} color={"green.500"}>
            {pointsIsLoading || transactionsLoad ? (
              <Skeleton width={"100%"} height={7} />
            ) : (
              <>{currency(transactions.reduce((x, y) => x + y.total, 0))}</>
            )}
          </Heading>
        </Card>
        <Card p={6}>
          <Text
            color={"gray.400"}
            alignItems={"flex-end"}
            display={"flex"}
            mb={2}
          >
            <Icon
              as={BsPeople}
              color={"orange.500"}
              bg={"orange.100"}
              fontSize={"1.8rem"}
              p={1}
              rounded={"md"}
              mr={2}
            />
            Vsitas diárias
          </Text>
          <Heading fontSize={"1.5rem"} color={"orange.500"}>
            0
          </Heading>
        </Card>

        <Card p={6}>
          <Text
            color={"gray.400"}
            alignItems={"flex-end"}
            display={"flex"}
            mb={2}
          >
            <Icon
              as={BsPersonCheck}
              color={"purple.500"}
              bg={"purple.100"}
              fontSize={"1.8rem"}
              p={1}
              rounded={"md"}
              mr={2}
            />
            Gastos com estoque
          </Text>
          <Heading fontSize={"1.5rem"} color={"purple.500"}>
            {pointsIsLoading || transactionsLoad ? (
              <Skeleton width={"100%"} height={7} />
            ) : (
              <>
                {currency(transactionsStock.reduce((x, y) => x + y.total, 0))}
              </>
            )}
          </Heading>
        </Card>
      </SimpleGrid>
      <SimpleGrid minChildWidth={200} gap={4} mt={4}>
        <Card p={5}>
          <CharHome />
        </Card>
        <Card p={5}>
          <CharHomePizza />
        </Card>
        {/* <Card p={5} >
              <CharHome/>
        </Card> */}
      </SimpleGrid>
      {/* <Card p={6}>
        <CharHome />
      </Card> */}
      {/* <Box mt={4}>
        <EmptyBox
          title="Você ainda não possui dados suficientes para geração de relatórios!"
          description="Começe a usar a plataforma para acumular dados."
        />
      </Box> */}
    </>
  );
}
