import {
  Button,
  useToast,
  Text,
  Box,
  Flex,
  Heading,
  Icon,
  Select,
  SimpleGrid,
  Input,
  InputGroup,
  InputRightElement,
  Grid,
  GridItem,
  FormControl,
  FormLabel,
  Image,
  Textarea,
  Divider,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import api from "../../services/api";
import { useEffect, useState } from "react";
import { currencyConfig } from "../../utils/currency";
import IntlCurrencyInput from "react-intl-currency-input";
import { CheckCircleIcon, CloseIcon } from "@chakra-ui/icons";
import { currency } from "../../utils/currency";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "../Card";
import TopRecive from "../../assets/toprecive.svg";
import { BiCheckCircle, BiPrinter, BiReceipt } from "react-icons/bi";
import { ConfirmModal } from "../ConfirmModal";
import moment from "moment";
import { Link } from "react-router-dom";

interface ItemsToSend {
  id: string;
}
interface productOrders {
  id: string;
  amount: number;
  note: string;
  product: {
    name: string;
    price: string;
    id: string;
  };
}
interface ProductToLauch {
  createdAt: string;
  delivery: boolean;
  id: string;
  moneyChange: string;
  note: string;
  productOrders: productOrders[];
  referenceCode: number;
  totalValue: string;
  updatedAt: string;
}

interface Command {
  active: boolean;
  id: string;
  clientName: string;
  commandCode: {
    code: number;
  };
  totalValue: number;
  orders: ProductToLauch[];
  closedAt?: string;
  createdAt?: string;
  table: {
    number: number;
  };
  transactions?: {
    total: number;
  }[];
}

export function ViewCommandModal() {
  const navigate = useNavigate();
  const { comandaId } = useParams();
  const [loadSave, setLoadSave] = useState(false);
  const toast = useToast();
  const [command, setCommand] = useState<Command>();
  const [totalValue, setTotalValue] = useState<String | number>(currency(0));
  const [paymentTypes, setPaymentTypes] = useState<any[]>([]);

  const [tipSelect, setTipSelect] = useState("1");
  const [tipInput, setTipInput] = useState("10");
  const [tip, setTip] = useState(0);
  const [paymentValueInput, setPaymentValueInput] = useState(0);
  const [divideBy, setDivideBy] = useState(0);
  const [paymentIdInput, setPaymentIdInput] = useState("");
  const [confirmModal, setConfirmModal] = useState(false);
  function getCommand() {
    setLoadSave(true);
    api
      .get(`/api/commands/${comandaId}`)
      .then((response) => {
        setCommand(response.data);
        setPaymentValueInput(response.data.totalValue);
      })
      .finally(() => {
        setLoadSave(false);
      });
  }

  useEffect(() => {
    if (comandaId) {
      getCommand();
      api
        .get(`/api/form-of-payments`)
        .then((response) => {
          setPaymentTypes(response.data);
        })
        .finally(() => {
          setLoadSave(false);
        });
    }
  }, [comandaId, totalValue]);

  function closeCommand() {
    if (paymentValueInput && paymentIdInput) {
      setLoadSave(true);
      api
        .post("/api/commands/apply-payment", {
          commandId: comandaId,
          formOfPayment: {
            paymentId: paymentIdInput,
            value: paymentValueInput + tip,
          },
          discount: 0,
          tip: tip,
          observation: "",
        })
        .then((response) => {
          toast({
            title: "Sucesso!",
            description: "Pagamento realizado com sucesso!",
            status: "success",
            duration: 4000,
            isClosable: true,
          });
          setConfirmModal(false);
          setPaymentIdInput("");
          setPaymentValueInput(0);
          setTip(0);
          setTipInput("10");
          setTipSelect("1");
          getCommand();
        })
        .catch((err) => {
          toast({
            title: "Error ao fechar comanda!",
            description: err.response.data.message,
            status: "error",
            duration: 4000,
            isClosable: true,
          });
        })
        .finally(() => {
          setLoadSave(false);
        });
    }

    if (!!command && command.active) {
      const newValue = currency(command?.totalValue as number);
      setTotalValue(newValue);
    }
  }

  return (
    <Grid gridTemplateColumns={"3fr 1.5fr"} gap={6}>
      <GridItem>
        <Card>
          <Flex align="center" justifyContent="start" mb={4}>
            <Box
              borderRadius="50%"
              display="flex"
              justifyContent="center"
              alignItems="center"
              width={"60px"}
              boxShadow="lg"
              height={"60px"}
              position="relative"
              bg="gray.200"
              color="gray.500"
            >
              {command?.active ? (
                <>
                  {" "}
                  <Heading>{command?.commandCode.code}</Heading>
                </>
              ) : (
                <BiReceipt size={31} />
              )}
            </Box>

            <Text textAlign="start" ms={3} as="h6" size="sm">
              {command?.clientName}
              <br />
              Mesa: {command?.table ? command?.table?.number : "Sem mesa"}
              <Text
                textAlign="center"
                fontSize="xs"
                color={command?.active ? "green" : "red.400"}
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                {command?.active ? (
                  <>
                    <Icon as={CheckCircleIcon} me={"3"} /> Comanda aberta
                  </>
                ) : (
                  <>
                    <Icon as={CloseIcon} me={"3"} /> Comanda fechada em{" "}
                    {command?.closedAt &&
                      moment(command?.closedAt).format("DD/MM/YYYY HH:mm")}
                  </>
                )}
              </Text>
            </Text>
          </Flex>
          <Box overflowY="auto" maxH="350px" paddingRight={4}>
            {command?.orders.map((x) =>
              x.productOrders.map((y) => (
                <Flex
                  flexDirection={"column"}
                  background="gray.100"
                  padding="4"
                  borderRightRadius={"xl"}
                  borderLeft="4px solid"
                  borderLeftColor="green.400"
                  mb="4"
                >
                  <Flex align="center" justifyContent="space-between">
                    <Text>
                      {y.amount}x {y.product.name}
                    </Text>
                    <Heading size="sm" color="green">
                      {currency(Number(y.product.price) * Number(y.amount))}
                    </Heading>
                  </Flex>
                  <Text fontSize="xs">{y.note}</Text>
                </Flex>
              ))
            )}
          </Box>
          <Flex align="center" justify="end">
            <Text mt={4} size="md" me={3}>
              Total:{" "}
            </Text>
            <Heading size="md" mt={4} color="green">
              {currency(
                command?.orders?.reduce(
                  (a, b) => a + Number(b.totalValue),
                  0
                ) as number
              )}
            </Heading>
            {command?.active ? (
              <>
                {" "}
                <Text mt={4} size="md" mx={3}>
                  Total restante :{" "}
                </Text>
                <Heading size="md" mt={4} color="#ECD109">
                  {command.totalValue}
                </Heading>
              </>
            ) : (
              <>
                <Text mt={4} size="md" mx={3}>
                  Total recebido :{" "}
                </Text>
                <Heading size="md" mt={4} color="green">
                  {/* {totalValue} */}
                  {currency(
                    command?.transactions?.reduce(
                      (a, b) => a + Number(b.total),
                      0
                    ) || 0
                  )}
                </Heading>
              </>
            )}
          </Flex>
          {command && command.active && (
            <form>
              <Flex w={"100%"} justifyContent={"flex-end"} gap={3}>
                <Button
                  // disabled={paymentIdInput === "" || paymentValueInput === 0}
                  colorScheme="blue"
                  onClick={() => navigate(`/pedidos/new/${comandaId}`)}
                >
                  Lançar Pedidos
                </Button>
              </Flex>
            </form>
          )}
        </Card>
      </GridItem>

      <ConfirmModal
        isOpen={confirmModal}
        onLoad={loadSave}
        onClose={() => setConfirmModal(false)}
        onConfirm={() => closeCommand()}
        title="Deseja Realmente lançar esse pagamento?"
        onCancel={() => setConfirmModal(false)}
        buttonColor="green"
        buttonTitle="Confirmar"
        body={
          <Box>
            <Text>
              <strong>comanda: </strong> {command?.commandCode.code} -{" "}
              {command?.clientName}
            </Text>
            <Text>
              <strong>Forma de pagamento: </strong>{" "}
              {paymentTypes.find((p) => p.id === paymentIdInput)?.form}
            </Text>
            <Text>
              <strong>subtotal: </strong> {currency(paymentValueInput)}
            </Text>
            <Text>
              <strong>Gorjeta: </strong> {currency(tip)}
            </Text>
            <Text mt={4} fontSize="lg">
              <strong>
                Valor cobrado:
                {currency(paymentValueInput + tip)}
              </strong>{" "}
            </Text>
          </Box>
        }
      />
    </Grid>
  );
}
