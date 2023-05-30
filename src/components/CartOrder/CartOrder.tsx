import { useEffect, useContext, useState } from "react";
import {
  Flex,
  Box,
  Heading,
  Icon,
  IconButton,
  Tooltip,
  List,
  ListItem,
  Text,
  Button,
  Checkbox,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";

import { GrCart } from "react-icons/gr";
import { AiOutlineSend } from "react-icons/ai";
import { IoMdTrash } from "react-icons/io";
import { BiArrowBack } from "react-icons/bi";

import CartContext from "../../contexts/CartProducts";
import { currency } from "../../utils/currency";

import { ConfirmModal } from "../ConfirmModal";
import { DiscountOrTaxModal } from "../DiscountOrTaxModal";
import api from "../../services/api";

interface ItemsToSend {
  id: string;
  amount: number;
}

interface complementsToSend {
  id: string;
  itens: ItemsToSend[];
}
interface ProductToSend {
  productId: string;
  price: number;
  amount: number;
  name: string;
  obs: string;
  complements: complementsToSend[];
}

function truncate(str: string, n: number) {
  return str?.length > n ? str.substr(0, n - 1) + "..." : str;
}
interface Prop {
  cart: ProductToSend[];
  updateCart: (cart: ProductToSend[]) => void;
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
}
export function CartOrder({ cart, updateCart }: Prop) {
  const navigate = useNavigate();
  const { comandaId } = useParams();

  const { cartProducts, setCartProducts } = useContext(CartContext);
  const [subTotal, setSubTotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [load, setLoad] = useState(false);
  const [deleteCartOpen, setDeleteCartOpen] = useState("");
  const [backCommandOpen, setBackCommandOpen] = useState("");

  const [newDicountOpen, setNewDiscountOpen] = useState(false);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [marked, setMarked] = useState<number[]>([]);
  const [command, setCommand] = useState<Command>();

  useEffect(() => {
    api
      .get(`/api/commands/${comandaId}`)
      .then((response) => {
        setCommand(response.data);
      })
      .finally(() => {});
    function sumTotal() {
      const sum = cartProducts.reduce((prev, curr) => {
        return prev + curr.price * curr.qtd;
      }, 0);
      setTotal(sum);
    }
    sumTotal();
  }, [cartProducts, total, totalDiscount, marked]);

  function calculate() {
    if (totalDiscount !== 0) {
      const percentage = totalDiscount / 100;

      const discounted = percentage * subTotal;

      setTotal(subTotal - discounted);
    }
  }

  function backToCommand() {
    navigate(`/comandas/${comandaId}`);
  }

  function addToSelection(target: number) {
    const copy = [...marked];
    const index = marked.findIndex((item) => item === target);
    if (index > -1) {
      copy.splice(index, 1);
    } else {
      copy.push(target);
    }
    setMarked([...copy]);
  }

  function cleanCart() {
    let array = [...cart];
    updateCart(array.filter((_, index) => !marked.includes(index)));
    setMarked([]);
    setDeleteCartOpen("");
  }

  function sendOrder() {
    setLoad(true);
    api
      .post(`/api/orders`, {
        pointOfSaleId: "d302fb50-a441-4a9e-b1a5-f71ee440438b",
        commandId: comandaId,
        delivery: false,
        statusOrderId: "8a26c80d-4ade-4c6b-b708-238af330921d",
        obs: "",
        products: cart.map((product) => ({
          productId: product.productId,
          amount: product.amount,
          note: product.obs,
        })),
      })
      .then((response) => {
        navigate(`/comandas/${comandaId}`);
      })
      .finally(() => {
        setLoad(false);
      });
  }

  return (
    <Flex
      background={"white"}
      borderRadius={"10px"}
      flexDirection={"column"}
      p={4}
      gap={2}
    >
      <Box h={"40px"} display={"flex"} gap={2} alignItems={"center"}>
        <IconButton
          icon={<BiArrowBack width={25} height={25} fontWeight="bold" />}
          aria-label="Voltar para Comanda"
          size="sm"
          color="white"
          background="red"
          borderRadius="full"
          onClick={() => setBackCommandOpen("true")}
        />
        <Icon as={GrCart} boxSize={5} color={"gray"} />
        <Heading size="md" color={"gray"}>
          Comanda {command?.commandCode.code}
        </Heading>
        {/* <IconButton
          icon={<RiPencilFill />}
          boxSize={5}
          color={"gray"}
          background={"white"}
          aria-label="Edit Title"
          fontSize="18px"
        /> */}
      </Box>
      <List display="flex" flexDirection="column" gap={2} h="70%" maxH="70%">
        {cart.map((product, key) => {
          const check = marked.includes(key);
          return (
            <ListItem
              display={"flex"}
              justifyContent="space-between"
              alignItems="center"
              h={"30px"}
            >
              <Flex gap={2}>
                <Checkbox
                  colorScheme="green"
                  value={product.productId}
                  isChecked={check}
                  checked={check}
                  onChange={() => addToSelection(key)}
                />
                <Text
                  background="gray"
                  h="20px"
                  w="20px"
                  textAlign="center"
                  color="white"
                  borderRadius="3px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="14px"
                >
                  {product.amount}
                </Text>
                <Text fontSize="14px">{product.name}</Text>
                {product.obs && (
                  <Text fontSize="12px" color="red">
                    ({truncate(product.obs, 10)})
                  </Text>
                )}
              </Flex>
              <Text fontSize="14px">{currency(product.price)}</Text>
            </ListItem>
          );
        })}
      </List>
      <Box
        h="60px"
        display="flex"
        justifyContent="space-around"
        flexDirection="column"
      >
        {/* <Flex justifyContent="space-between" alignItems="center">
          <Text fontWeight="bold" fontSize="14px">
            Subtotal
          </Text>
          <Text fontSize="15px" fontWeight="bold">
            {currency(subTotal)}
          </Text>
        </Flex> */}
        <Flex justifyContent="space-between" alignItems="center">
          <Text fontWeight="bold" fontSize="17px">
            Total
          </Text>
          <Text fontSize="15px" fontWeight="bold">
            {currency(total)}
          </Text>
        </Flex>
      </Box>
      <Flex h="40px" gap={2} justifyContent="space-between">
        <Tooltip label="Enviar pedido">
          <Button
            w="50%"
            h="40px"
            p="10px"
            color="white"
            aria-label="enviar pedido"
            fontSize="25px"
            background={"green.500"}
            display="flex"
            justifyContent="space-between"
            onClick={() => sendOrder()}
          >
            <AiOutlineSend width="20px" height="20px" />

            <Text fontSize={"16px"}>Enviar Pedido</Text>
          </Button>
        </Tooltip>
        <Tooltip label="Excluir pedido">
          <Button
            w="50%"
            h="40px"
            color="white"
            p="10px"
            aria-label="Excluir pedido"
            fontSize="25px"
            background="#EF512E"
            display="flex"
            justifyContent="space-between"
            onClick={() => setDeleteCartOpen("true")}
          >
            <IoMdTrash />
            <Text fontSize={"16px"}>Excluir Seleção</Text>
          </Button>
        </Tooltip>
        {/* <Tooltip label="Aplicar desconto">
          <IconButton
            w="25%"
            h="40px"
            color="white"
            aria-label="Aplicar desconto"
            fontSize="25px"
            background="#EFDD2E"
            icon={<MdAttachMoney />}
            onClick={() => {
              setNewDiscountOpen(true);
            }}
          />
        </Tooltip>
        <Tooltip label="Aplicar acrescimo">
          <IconButton
            w="25%"
            h="40px"
            color="white"
            aria-label="Aplicar acrescimo"
            fontSize="25px"
            background="#2EEF91"
            icon={<AiOutlinePercentage />}
          />
        </Tooltip> */}
      </Flex>
      <ConfirmModal
        isOpen={deleteCartOpen !== ""}
        onClose={() => setDeleteCartOpen("")}
        onCancel={() => setDeleteCartOpen("")}
        title="Limpar Pedido"
        body={
          <Text>Tem certeza que deseja excluir os produtos selecionados?</Text>
        }
        onConfirm={cleanCart}
        onLoad={load}
      />
      <ConfirmModal
        isOpen={backCommandOpen !== ""}
        onClose={() => setBackCommandOpen("")}
        onCancel={() => setBackCommandOpen("")}
        title="Voltar para Comanda e cancelar o pedido"
        body={<Text>Tem certeza que deseja cancelar este pedido?</Text>}
        onConfirm={backToCommand}
        onLoad={load}
        buttonTitle="Voltar para Comanda"
      />
      <DiscountOrTaxModal
        onSave={() => {
          setNewDiscountOpen(false);
        }}
        onCloseModal={() => {
          setNewDiscountOpen(false);
        }}
        open={newDicountOpen}
        percentage={totalDiscount}
        setPercentage={setTotalDiscount}
        title="Desconto"
        calculate={calculate}
      />
    </Flex>
  );
}
