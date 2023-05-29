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
interface ProductToLauch {
  id: string;
  name: string;
  amount: number;
  price: number;
  totalPrice: number;
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
}

export function ViewCommandModal() {
  const navigate = useNavigate();
  const { comandaId } = useParams();
  const [loadSave, setLoadSave] = useState(false);
  const toast = useToast();
  const [command, setCommand] = useState<Command>();
  const [totalValue, setTotalValue] = useState<String | number>(currency(0))
  const [paymentTypes, setPaymentTypes] = useState<any[]>([]);

  const [tipSelect, setTipSelect] = useState("1");
  const [tipInput, setTipInput] = useState("10");
  const [tip, setTip] = useState(0);
  const [paymentValueInput, setPaymentValueInput] = useState(0);
  const [divideBy, setDivideBy] = useState(0);
  const [paymentIdInput, setPaymentIdInput] = useState("");
  const [confirmModal, setConfirmModal] = useState(false);

  useEffect(() => {
    if (comandaId) {
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
      api
        .get(`/api/form-of-payments`)
        .then((response) => {
          setPaymentTypes(response.data);
        })
        .finally(() => {
          setLoadSave(false);
        });
    }
    
  }, [comandaId,totalValue]);

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

    if(!!command && command.active){
      const newValue = currency(command?.totalValue as number)
      setTotalValue(newValue)
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
            {command?.orders.map((x) => (
              <Flex
                align="center"
                justifyContent="space-between"
                background="gray.100"
                padding="4"
                borderRightRadius={"xl"}
                borderLeft="4px solid"
                borderLeftColor="green.400"
                mb="4"
              >
                <Text>
                  {x.amount}x {x.name}
                </Text>
                <Heading size="sm" color="green">
                  {currency(x.totalPrice)}
                </Heading>
              </Flex>
            ))}
          </Box>
          <Flex align="center" justify="end">
            <Text mt={4} size="md" me={3}>
              Total:{" "}
            </Text>
            <Heading size="md" mt={4} color="green">
              {currency(
                command?.orders?.reduce((a, b) => a + b.totalPrice, 0) as number
              )}
            </Heading>
            {command?.active ? (
              <>
                {" "}
                <Text mt={4} size="md" mx={3}>
                  Total restante :{" "}
                </Text>
                <Heading size="md" mt={4} color="#ECD109">
                  {totalValue}
                </Heading>
              </>
            ) : (
              <>
                <Text mt={4} size="md" mx={3}>
                  Total recebido :{" "}
                </Text>
                <Heading size="md" mt={4} color="green">
                  {/* {totalValue} */}
                  R$ 0,00
                </Heading>
              </>
            )}
          </Flex>
          {command && command.active && (
            <form>
              <Text my={4}>Lançe pagamentos nessa comanda</Text>
              <SimpleGrid minChildWidth={200} gap={2}>
                <FormControl mb={3}>
                  <Select
                    required
                    onChange={(e) => setPaymentIdInput(e.target.value)}
                    value={paymentIdInput}
                  >
                    <option>forma de pagamento</option>
                    {paymentTypes?.map((x) => (
                      <option key={x.id} value={x.id}>
                        {x.form}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl mb={3}>
                  <Select
                    required
                    onChange={(e) => {
                      if (Number(e.target.value) > 0) {
                        setPaymentValueInput(
                          command.totalValue / Number(e.target.value)
                        );
                      }
                      setDivideBy(Number(e.target.value));
                    }}
                    value={divideBy}
                  >
                    <option value={0}>Dividir por pessoa</option>
                    <option value={1}>Apenas 1</option>
                    <option value={2}>Dividir para 2</option>
                    <option value={3}>Dividir para 3</option>
                    <option value={4}>Dividir para 4</option>
                    <option value={5}>Dividir para 5</option>
                    <option value={6}>Dividir para 6</option>
                    <option value={7}>Dividir para 7</option>
                    <option value={8}>Dividir para 8</option>
                    <option value={9}>Dividir para 9</option>
                    <option value={10}>Dividir para 10</option>
                  </Select>
                </FormControl>
              </SimpleGrid>
              <FormControl mb={3}>
                <IntlCurrencyInput
                  currency="BRL"
                  config={currencyConfig}
                  className="phoneInput"
                  defaultValue={paymentValueInput}
                  value={paymentValueInput}
                  onChange={(event: any, value: number, maskedValued: string) =>
                    setPaymentValueInput(value)
                  }
                />
              </FormControl>
              <FormControl mb={3}>
                <FormLabel>
                  <Text>Calcule a gorjeta</Text>
                </FormLabel>
                <Flex gap={2}>
                  <Select
                    w={"90px"}
                    value={tipSelect}
                    onChange={(e) => {
                      setTipInput("");
                      setTip(0);
                      setTipSelect(e.target.value);
                    }}
                  >
                    <option value={"1"}>%</option>
                    <option value={"2"}>R$</option>
                  </Select>
                  <InputGroup minW={400}>
                    <Input
                      minW={400}
                      placeholder="Digite o valor da gorjeta"
                      className="phoneInput"
                      value={tipInput}
                      type="number"
                      onChange={(e) => {
                        setTip(0);
                        setTipInput(e.target.value);
                      }}
                    />
                    <InputRightElement width="fit-content" mr={1}>
                      <Button
                        disabled={tipInput === ""}
                        h="1.75rem"
                        variant={tip > 0 ? "ghost" : "solid"}
                        colorScheme={tip > 0 ? "green" : "gray"}
                        size="sm"
                        onClick={() => {
                          if (tipSelect === "1") {
                            setTip(
                              (command.totalValue * Number(tipInput)) / 100
                            );
                          } else {
                            setTip(Number(tipInput));
                          }
                        }}
                      >
                        {tip > 0 ? (
                          <>
                            <BiCheckCircle /> Gorjeta aplicada
                          </>
                        ) : (
                          "Aplicar"
                        )}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </Flex>
              </FormControl>
              {/* <FormControl mb={3}>
                <FormLabel>
                  <Text> Aplicar desconto</Text>
                </FormLabel>
                <Flex gap={2}>
                  <Select w={"90px"} value={1}>
                    <option value={1}>%</option>
                    <option value={2}>R$</option>
                  </Select>
                  <InputGroup minW={400}>
                    <Input
                      minW={400}
                      config={currencyConfig}
                      className="phoneInput"
                      value={paymentValueInput}
                      onChange={(e) => e.target.value}
                    />
                    <InputRightElement width="fit-content" mr={1}>
                      <Button h="1.75rem" size="sm">
                        Somar
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </Flex>
              </FormControl> */}
              <FormControl mb={3}>
                <FormLabel>
                  <Text>Observações</Text>
                </FormLabel>
                <Textarea />
              </FormControl>
              <Flex 
                w={"100%"}
                justifyContent={"flex-end"}
                gap={3}>
                <Button
                  // disabled={paymentIdInput === "" || paymentValueInput === 0}
                  colorScheme="blue"
                  onClick={() => navigate(`/pedidos/new/${comandaId}`)}
                  
                >
                  Lançar Pedidos
                </Button>
                <Button
                  disabled={paymentIdInput === "" || paymentValueInput === 0}
                  colorScheme="green"
                  onClick={() => setConfirmModal(true)}
                  
                >
                  Realizar Pagamento
                </Button>
              </Flex>
            </form>
          )}
        </Card>
      </GridItem>
      <GridItem>
        <Box
          w={"100%"}
          bg="#FDF5AB"
          p={4}
          pt={16}
          position="relative"
          mt={10}
          boxShadow="md"
        >
          <Box w={"100%"} position="absolute" left={0} bottom={"98%"}>
            <Image src={TopRecive} w={"100%"} />
          </Box>

          <Heading
            size="sm"
            fontWeight="bold"
            fontFamily="mono"
            color="black"
            as="h1"
          >
            Atelie do Chef
          </Heading>
          <Text fontSize="xs" fontFamily="mono" color="black">
            R. Frei Manoel Procópio, 3456
          </Text>
          <Text fontSize="xs" fontFamily="mono" color="black">
            Centro, Imperatriz - MA, 65900-040
          </Text>
          <Text fontSize="xs" fontFamily="mono" color="black">
            ateliedochef@gmail.com
          </Text>
          <Text fontSize="xs" fontFamily="mono" color="black">
            CNPJ: 00.000.000/0000-00
          </Text>
          <Divider
            variant="dashed"
            colorScheme="blackAlpha"
            borderColor="black"
            my={2}
          />
          <Text fontSize="xs" fontFamily="mono" color="black">
            <strong>Mesa: </strong> 12 <strong>Garçom: </strong> Matheus{" "}
            <strong>cx: </strong> 129382390921232312
          </Text>
          <TableContainer mt={3}>
            <Table variant="simple" size="sm" colorScheme="blackAlpha">
              <Thead>
                <Tr
                  borderBottom="1px dashed black"
                  borderTop="1px dashed black"
                >
                  <Th
                    fontWeight="bold"
                    fontFamily="mono"
                    color="black"
                    textAlign="start"
                    border="none"
                    pl={0}
                  >
                    QT.
                  </Th>
                  <Th
                    fontWeight="bold"
                    fontFamily="mono"
                    color="black"
                    border="none"
                    pl={0}
                  >
                    Descrição
                  </Th>
                  <Th
                    fontWeight="bold"
                    fontFamily="mono"
                    color="black"
                    isNumeric
                    border="none"
                    pl={0}
                  >
                    VR. TOTAL
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {command?.orders.map((x) => (
                  <Tr>
                    <Td
                      fontWeight="bold"
                      fontFamily="mono"
                      color="black"
                      textAlign="start"
                      border="none"
                      pl={0}
                      py={"2px"}
                      my={"2px"}
                    >
                      {x.amount}
                    </Td>
                    <Td
                      fontWeight="bold"
                      fontFamily="mono"
                      color="black"
                      textAlign="start"
                      border="none"
                      pl={0}
                      py={"2px"}
                      my={"2px"}
                    >
                      {x.name}
                    </Td>
                    <Td
                      fontWeight="bold"
                      fontFamily="mono"
                      color="black"
                      textAlign="start"
                      border="none"
                      pl={0}
                      py={"2px"}
                      my={"2px"}
                      isNumeric
                    >
                      {currency(x.totalPrice as number)}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          <Divider
            variant="dashed"
            colorScheme="blackAlpha"
            borderColor="black"
            mt={2}
          />
          <Text
            fontSize="xs"
            fontFamily="mono"
            color="black"
            display="flex"
            justifyContent="space-between"
          >
            <strong>Subtotal: </strong>{" "}
            <strong>
              {" "}
              {currency(
                command?.orders?.reduce((a, b) => a + b.totalPrice, 0) as number
              )}
            </strong>
          </Text>
          <Text
            fontSize="xs"
            fontFamily="mono"
            color="black"
            display="flex"
            justifyContent="space-between"
          >
            <strong>taxa de serviço: ({tipInput}) </strong>{" "}
            <strong> {currency(tip)}</strong>
          </Text>
          <Text
            fontSize="xs"
            fontFamily="mono"
            color="black"
            display="flex"
            justifyContent="space-between"
          >
            <strong>Total: </strong>{" "}
            <strong>
              {" "}
              {currency(
                tip +
                  (command?.orders?.reduce((a, b) => a + b.totalPrice, 0) || 0)
              )}
            </strong>
          </Text>
          <Text fontSize="xs" fontFamily="mono" color="black">
            {divideBy > 1 && command && (
              <strong>
                {currency(command?.totalValue / divideBy)} por pessoa (
                {divideBy}){" "}
              </strong>
            )}
          </Text>
          <Text fontSize="xs" fontFamily="mono" color="black">
            <strong>permanência: </strong>
            {moment(command?.createdAt).diff(moment(), "hours") * -1}h {(moment(command?.createdAt).diff(moment(), "minutes") * -1) % 60} min
          </Text>
          <Divider
            variant="dashed"
            colorScheme="blackAlpha"
            borderColor="black"
            my={2}
          />
          <Text textAlign="end" fontSize="xs" fontFamily="mono" color="black">
            <strong>Em 23/03/2021 12:00</strong>
          </Text>
        </Box>
        <Flex mt={5}>
          <Button variant="solid" colorScheme="blue" leftIcon={<BiPrinter />}>
            Imprimir Via do cliente
          </Button>
        </Flex>
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
