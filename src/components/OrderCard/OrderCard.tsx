import { useEffect, useState, useContext } from "react";

import { AiOutlineEye } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";
import { HiArrowNarrowRight } from "react-icons/hi";

import {
  Box,
  Text,
  Flex,
  Icon,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";

import { telMask } from "../../utils/masks";
import { currency } from "../../utils/currency";
import { IOrderProps } from "../../pages/Orders/Orders";
import { OrderModel } from "../../utils/models";
import { useOrderDragAndDrop } from "../../hooks/useOrderDragAndDrop";

import { ConfirmModal } from "../ConfirmModal";
import OrderContext from "../../contexts/setOrders";

// export interface IOrderCardProps {
//   orderId?: number;
//   customer: string;
//   phone: number;
//   price: number;
//   origin: string;
//   status?: string;
// }

// type OrderProps = {
//   order: OrderModel;
//   index: number;
// };

export function OrderCard({ id, command, status, products, obs, columnStatus }: IOrderProps) {
  // const { ref, isDragging } = useOrderDragAndDrop<HTMLDivElement>({
  //   order,
  //   index,
  // });
  const { orders, setOrders, statusColumns } = useContext(OrderContext);

  const [ isMounted, setIsMounted ] = useState(true);

  const [nameCustomer, setNameCustomer] = useState("");
  const [maskedNumber, setMaskedNumber] = useState("");
  const [maskedPrice, setMaskedPrice] = useState("");
  const [orderStatus, setOrderStatus] = useState(status);
  const [seeOrderDetails, setSeeOrderDetails] = useState("");
  const [changeStatusOpen, setChangeStatusOpen] = useState("");

  function setMounted(){
    if(status !== columnStatus){
      setIsMounted(false)
    }
  }

  useEffect(() => {
    if (command.name.length >= 15) {
      const slicedName = command.name.slice(0, 12) + "...";
      setNameCustomer(slicedName);
    } else {
      setNameCustomer(command.name);
    }

    if(status === columnStatus){
      setIsMounted(true)
    }
   

    setMaskedNumber(telMask("" + command.phone));
    setMaskedPrice(currency(products[0].price));

    return () => {
      setMounted()
      console.log("Desmontou mas sou otario")
    };
  }, [status, isMounted]);

  function advanceOrderStatus() {
    const ordersCopy = [...orders];
    const findOrderIndex = orders.findIndex((elem) => {
      return elem.id === id;
    });

    if (ordersCopy[findOrderIndex].status === statusColumns[3]) {
      return;
    }

    switch (ordersCopy[findOrderIndex].status) {
      case statusColumns[0]:
        ordersCopy[findOrderIndex].status = statusColumns[1];
        break;
      case statusColumns[1]:
        ordersCopy[findOrderIndex].status = statusColumns[2];
        break;
      case statusColumns[2]:
        ordersCopy[findOrderIndex].status = statusColumns[3];
        break;
    }

    setOrders(ordersCopy);
  }

  function changeOrderStatus(status: string) {
    const ordersCopy = [...orders];
    const findOrderIndex = orders.findIndex((elem) => {
      return elem.id === id;
    });

    ordersCopy[findOrderIndex].status = status;
    setOrders(ordersCopy);
    setChangeStatusOpen("");
  }

  return (
    <>
      {
        isMounted ? 
        <>
        <Box
          w={"100%"}
          h={"70px"}
          boxShadow="xs"
          rounded="md"
          padding={"4px"}
          display={"flex"}
          justifyContent={"space-between"}
          // opacity={isDragging ? 0.5 : 1}
          // cursor={isDragging ? "grabbing" : "grab"}
          // ref={ref}
        >
          <Flex flexDirection={"column"} justifyContent={"space-between"}>
            <Text fontSize={"13px"} color={"#8b8b80"}>
              {nameCustomer}
            </Text>
            <Text fontSize={"13px"} color={"#8b8b80"}>
              {maskedNumber}
            </Text>
            <Text fontSize={"13px"} color={"#8b8b80"}>
              {maskedPrice}
            </Text>
          </Flex>
  
          <Flex flexDirection={"column"} justifyContent={"space-between"}>
            <Box display={"flex"} gap={"4px"} justifyContent={"flex-end"}>
              <IconButton
                icon={<AiOutlineEye />}
                aria-label="openmodal"
                size="xs"
                h="20px"
                background="white"
                onClick={() => setSeeOrderDetails("open")}
              />
              <Menu>
                <MenuButton as={Button} size="xs" h="20px" background="white">
                  <Icon as={BsThreeDotsVertical} />
                </MenuButton>
                <MenuList>
                  <MenuItem
                    onClick={() => {
                      setChangeStatusOpen("Pendente");
                    }}
                  >
                    Pendente
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setChangeStatusOpen("Preparando");
                    }}
                  >
                    Preparando
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setChangeStatusOpen("Pronto");
                    }}
                  >
                    Pronto
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setChangeStatusOpen("Saiu para Entrega");
                    }}
                  >
                    Saiu para Entrega
                  </MenuItem>
                </MenuList>
              </Menu>
            </Box>
            <IconButton
              aria-label="avançar"
              icon={<HiArrowNarrowRight color="white" />}
              backgroundColor={"green.500"}
              size="sm"
              w="20px"
              h="17px"
              alignSelf="end"
              onClick={() => {
                advanceOrderStatus();
              }}
            />
            {/* <Box
            backgroundColor={"green.500"}
            w={"60px"}
            h={"20px"}
            borderRadius={"10px"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <Text color={"gray.500"} fontSize={"13px"}>
              {order.origin}
            </Text>
          </Box> */}
          </Flex>
        </Box>
        <ConfirmModal
          isOpen={seeOrderDetails !== ""}
          onClose={() => setSeeOrderDetails("")}
          onCancel={() => setSeeOrderDetails("")}
          title="Detalhes do pedido"
          buttonTitle="OK"
          buttonColor="green"
          body={
            <>
              <Text mb="20px" fontSize="18px">
                {!!obs && obs}
              </Text>
              {products.map((prod) => {
                return (
                  <>
                    <Text fontWeight="bold" fontSize="18px">
                      Produtos:
                    </Text>
                    <Flex mb="20px">
                      {prod.name} x{prod.amount}
                    </Flex>
                    <Text fontWeight="bold" fontSize="18px">
                      Complementos:
                    </Text>
                    {prod.complement.map((comp) => {
                      return (
                        <>
                          <Text fontWeight="bold">{comp.title}</Text>
                          {comp.itens.map((item) => {
                            return (
                              <Text>
                                {item.title}: {item.amount}x{" "}
                                {currency(item.price)}
                              </Text>
                            );
                          })}
                        </>
                      );
                    })}
                  </>
                );
              })}
            </>
          }
          onConfirm={() => setSeeOrderDetails("")}
          // onLoad={load}
        />
        <ConfirmModal
          isOpen={changeStatusOpen !== ""}
          onClose={() => setChangeStatusOpen("")}
          onCancel={() => setChangeStatusOpen("")}
          title="Mudar Status do Pedido"
          buttonTitle="Mudar"
          buttonColor="green"
          body={
            <>
              <Text mb="20px" fontSize="18px">
                Tem certeza que deseja mudar o status do pedido para{" "}
                {changeStatusOpen}?
              </Text>
            </>
          }
          onConfirm={() => changeOrderStatus(changeStatusOpen)}
          // onLoad={load}
        /> 
        
        </> : <></>
      }
    </>
  );
}
