import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Select,
  SimpleGrid,
  Skeleton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { FaCashRegister, FaQrcode } from "react-icons/fa";
import { BsCash, BsCreditCard, BsPeople, BsPersonCheck } from "react-icons/bs";

import { Card } from "../../components/Card";
import { EmptyBox } from "../../components/EmptyBox";
import { useState, useEffect } from "react";
import api from "../../services/api";
import { logout } from "../../services/auth";
import { currency } from "../../utils/currency";
import { ArrowDownIcon, ArrowUpIcon } from "@chakra-ui/icons";
import { ComandaModal } from "../../components/NewComandaModal";
import { OpenCaixaModal } from "../../components/OpenCaixaModal";
import { PointOfSale } from "../../types";
import moment from "moment";
import { CloseCaixaModal } from "../../components/CloseCaixaModal copy";
const trans = [
  {
    reated_at: "2021-08-01T00:00:00.000Z",
    Created_by: "Matheus Santos",
    Subtotal: 90,
    Discount: 0,
    total: 100,
    Obs: "",
    method: [
      {
        payment_method: "pix",
        Value: 4.4,
      },
    ],
    comandaId: 1,
    caixaId: 1,
    tip: 10,
    origem: "local",
  },
  {
    reated_at: "2021-08-01T00:00:00.000Z",
    Created_by: "Matheus Santos",
    Subtotal: 70,
    Discount: 0,
    total: 85,
    Obs: "",
    method: [
      {
        payment_method: "Cartão de crédito",
        Value: 4.4,
      },
    ],
    comandaId: 2,
    caixaId: 1,
    tip: 15,
    origem: "delivery",
  },
];
interface Trasaction {
  createdAt: string;
  formOfPayment: string;
  id: string;
  saleChannel: string;
  total: number;
}
interface Box {
  initialValue: number;
  id: string;
  finalValue: number;
  status: string;
  openedAt: string;
  openedBy: {
    name: string;
  };
  closedAt: string;
  transactions?: Trasaction[];
}

export function Caixa() {
  const [transactions, setTransactions] = useState<Trasaction[]>([]);
  const [box, setBox] = useState<Box | undefined>(undefined);
  const [isOpenCiaxaModal, setIsOpenCaixaModal] = useState(false);
  const [isOpenCiaxaModalClose, setIsOpenCaixaModalClose] = useState(false);
  const [points, setPoints] = useState<PointOfSale[]>([]);
  const [pointTofilter, setPointToFilter] = useState("");
  const [pointsIsLoading, setPointsIsLoading] = useState(false);
  function getBox(pointId: string) {
    api
      .get(`/api/trading-box/point-of-sale/${pointId}`)
      .then((response) => {
        setBox(response.data);
        console.log(response.data);
      })
      .catch((err) => {
        if (err.response.data.statusCode === 401) {
          logout();
        }
      })
      .finally(() => {});
  }
  function getTransactions(pointId: string) {
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
      .finally(() => {});
  }

  useEffect(() => {
    setPointsIsLoading(true);
    api
      .get("/api/point-of-sale")
      .then((response) => {
        setPoints(response.data);
        setPointToFilter(response.data[0].id);
        getBox(response.data[0].id);
        getTransactions(response.data[0].id);
      })
      .finally(() => {
        setPointsIsLoading(false);
      });
  }, []);
  function getIngredients() {
    // api
    //   .get("/api/transactions/products")
    //   .then((response) => {
    //     setTransactions(response.data);
    //   })
    //   .catch((err) => {
    //     if (err.response.data.statusCode === 401) {
    //       logout();
    //     }
    //   })
    //   .finally(() => {});
  }
  useEffect(() => {
    getIngredients();
  }, []);
  return (
    <>
      {pointsIsLoading ? (
        <Skeleton height={"40px"} borderRadius={3} w={150} mb={4} />
      ) : (
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
      )}
      <Card
        p={6}
        mb={4}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        {box ? (
          <>
            <div>
              <Text
                color={"gray.400"}
                alignItems={"flex-end"}
                display={"flex"}
                mb={2}
              >
                <Icon
                  as={FaCashRegister}
                  color={"green.500"}
                  bg={"green.100"}
                  fontSize={"1.8rem"}
                  p={1}
                  rounded={"md"}
                  mr={2}
                />{" "}
                Valor em caixa
              </Text>
              <Heading fontSize={"1.5rem"} color={"green.500"}>
                {box &&
                  currency(
                    (box?.transactions?.reduce((acc, x) => acc + x.total, 0) as number +
                      box?.initialValue) as number
                  )}
              </Heading>
            </div>
            <Flex flexDirection="column" alignItems="end">
              <Text fontSize="sm" color="gray.500">
                Caixa aberto por: {box?.openedBy?.name}
              </Text>
              <Text fontSize="sm" color="gray.500">
                em {moment(box?.openedAt).format("DD/MM/YYYY HH:mm")}
              </Text>
              <Button
                onClick={() => setIsOpenCaixaModalClose(true)}
                colorScheme="red"
                mt={2}
              >
                Fechar caixa
              </Button>
            </Flex>
          </>
        ) : (
          <Flex w={"100%"} flexDir={"column"}>
            <Alert
              status="error"
              variant="subtle"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
            >
              <AlertIcon boxSize="40px" mr={0} />
              <AlertTitle mt={4} mb={1} fontSize="lg">
                Caixa fechado!
              </AlertTitle>
              <AlertDescription maxWidth="sm">
                Clique no botão abaixo para abrir um novo caixa.
              </AlertDescription>
            </Alert>
            <Button
              marginTop="1rem"
              paddingX="5rem"
              size="lg"
              marginX={"auto"}
              colorScheme={"green"}
              onClick={() => setIsOpenCaixaModal(true)}
            >
              Abrir caixa
            </Button>
          </Flex>
        )}
      </Card>
      <SimpleGrid minChildWidth={200} gap={4}>
        <Card p={6}>
          <Text
            color={"gray.400"}
            alignItems={"flex-end"}
            display={"flex"}
            mb={2}
          >
            <Icon
              as={BsCreditCard}
              color={"blue.500"}
              bg={"blue.100"}
              fontSize={"1.8rem"}
              p={1}
              rounded={"md"}
              mr={2}
            />{" "}
            Receita em cartão
          </Text>
          <Heading fontSize={"1.5rem"} color={"blue.500"}>
            {currency(
              transactions
                ?.filter(
                  (x) =>
                    x.formOfPayment === "Débito (Maquininha) " ||
                    x.formOfPayment === "Crédito (Maquininha)"
                )
                .reduce((a, b) => a + Number(b.total), 0)
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
              as={BsCash}
              color={"green.500"}
              bg={"green.100"}
              fontSize={"1.8rem"}
              p={1}
              rounded={"md"}
              mr={2}
            />
            Receita em dinheiro
          </Text>
          <Heading fontSize={"1.5rem"} color={"green.500"}>
            {currency(
              transactions
                ?.filter((x) => x.formOfPayment === "Dinheiro")
                .reduce((a, b) => a + Number(b.total), 0)
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
              as={FaQrcode}
              color={"orange.500"}
              bg={"orange.100"}
              fontSize={"1.8rem"}
              p={1}
              rounded={"md"}
              mr={2}
            />
            Receita por pix
          </Text>
          <Heading fontSize={"1.5rem"} color={"orange.500"}>
            {currency(
              transactions
                ?.filter((x) => x.formOfPayment === "Pix")
                .reduce((a, b) => a + Number(b.total), 0)
            )}
          </Heading>
        </Card>

        {/* <Card p={6}>
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
            {currency(transactions.reduce((x, y) => x + y.price, 0))}
          </Heading>
        </Card> */}
      </SimpleGrid>
      <Heading as="h6" size="md" mt={4}>
        Transações
      </Heading>
      <Box w={"100%"} mt={4} maxH={460} overflowY="auto">
        <TableContainer w="100%" bg="white" shadow="md">
          <Table>
            <Thead>
              <Tr>
                <Th></Th>
                <Th>Origem</Th>
                <Th>Método de pagamento</Th>
                <Th>Valor</Th>
                <Th>Data</Th>
              </Tr>
            </Thead>
            <Tbody>
              {transactions.map((x, k) => (
                <Tr>
                  <Td>
                    {x.total > 0 ? (
                      <Box
                        background="green.100"
                        borderRadius="full"
                        h="30px"
                        w="30px"
                        display="flex"
                        alignItems="center"
                        color="green.600"
                        justifyContent="center"
                      >
                        <ArrowDownIcon />
                      </Box>
                    ) : (
                      <Box
                        background="red.100"
                        borderRadius="full"
                        h="30px"
                        w="30px"
                        display="flex"
                        alignItems="center"
                        color="red.600"
                        justifyContent="center"
                      >
                        <ArrowUpIcon />
                      </Box>
                    )}
                  </Td>
                  <Td>{x.saleChannel}</Td>
                  <Td>{x.formOfPayment}</Td>
                  <Td color={x.total > 0 ? "green.500" : "red.500"}>
                    {currency(x.total)}
                  </Td>
                  <Td>{moment(x.createdAt).format("DD/MM/YYYY hh:mm")}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
      <Box mt={4}>
        {/* <EmptyBox
          title="Você ainda não possui dados suficientes para geração de relatórios!"
          description="Começe a usar a plataforma para acumular dados."
        /> */}
      </Box>
      <OpenCaixaModal
        onSave={() => {
          setIsOpenCaixaModal(false);
          getBox(pointTofilter);
          // getCommands(pointTofilter);
        }}
        pId={pointTofilter}
        onCloseModal={() => {
          setIsOpenCaixaModal(false);
        }}
        open={isOpenCiaxaModal}
      />
      <CloseCaixaModal
        onSave={() => {
          setIsOpenCaixaModalClose(false);
          getBox(pointTofilter);
          // getCommands(pointTofilter);
        }}
        pId={pointTofilter}
        onCloseModal={() => {
          setIsOpenCaixaModalClose(false);
        }}
        open={isOpenCiaxaModalClose}
      />
    </>
  );
}
