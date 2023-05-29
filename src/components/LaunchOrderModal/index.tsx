import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  FormControl,
  FormLabel,
  useToast,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Box,
  Flex,
  Textarea,
  HStack,
} from "@chakra-ui/react";
import api from "../../services/api";
import { useEffect, useState } from "react";
import { ProductProps } from "../../types";

import { IngredientModalProps } from "./NewComandaModal";

interface ProductToLauch {
  id: string;
  name: string;
  amount: number;
  price: number;
  totalPrice: number;
}
export function LaunchOrderModal({
  open,
  onCloseModal,
  onSave,
  posId,
}: IngredientModalProps) {
  const [loadSave, setLoadSave] = useState(false);
  const toast = useToast();
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [productsToLauch, setProductsToLauch] = useState<ProductToLauch[]>([]);
  function sendIfoodAuth() {
    setLoadSave(true);
    api
      .post("/api/orders", {
        pointOfSaleId: posId,
        commandId: open,
        delivery: false,
        products: productsToLauch,
      })
      .then((response) => {
        setProductsToLauch([]);
        toast({
          title: "Pedido lançado!",
          description: "",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        onSave();
      })
      .catch((err) => {
        toast({
          title: err.response.data.message,
          description: "",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      })
      .finally(() => {
        setLoadSave(false);
      });
  }

  function addProduct(productToAdd: ProductToLauch) {
    let productsList = productsToLauch;
    let p = productsList.findIndex((x) => x.id === productToAdd.id);
    if (p !== -1) {
      productsList[p].amount += 1;
      productsList[p].totalPrice =
        productsList[p].amount * productsList[p].price;
      setProductsToLauch([...productsList]);
    } else {
      setProductsToLauch([...productsToLauch, productToAdd]);
    }
  }
  function decProduct(productToAdd: ProductToLauch) {
    let productsList = productsToLauch;
    let p = productsList.findIndex((x) => x.id === productToAdd.id);
    if (p !== -1) {
      if (productsList[p].amount > 1) {
        productsList[p].amount -= 1;
        productsList[p].totalPrice =
          productsList[p].amount * productsList[p].price;
      } else {
        productsList.splice(p, 1);
      }

      setProductsToLauch([...productsList]);
    }
  }

  useEffect(() => {
    if (open.length > 0) {
      setLoadSave(true);
      // api.get("/api/point-of-sale").then((response) => {
      //   setPoints(response.data);
      // });
      api
        .get("/api/products")
        .then((response) => {
          setProducts(response.data);
        })
        .finally(() => {
          setLoadSave(false);
        });
    }
  }, [open]);

  function handleClose() {
    setProductsToLauch([]);
    onCloseModal();
  }
  return (
    <Modal size="2xl" isOpen={open.length > 0} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Lançar produtos na comanda</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box overflowY="auto" maxH="350px">
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Produto</Th>
                    <Th>Quantidade</Th>
                  </Tr>
                </Thead>
                <Tbody padding="0">
                  {products.map((x) => (
                    <Tr padding="0">
                      <Td paddingX="0">
                        <Flex align="center" gap="2">
                          <Box
                            borderRadius="full"
                            width="35px"
                            height="35px"
                            background="gray.300"
                            overflow="hidden"
                          >
                            <img
                              width="100%"
                              height="100%"
                              src={
                                x.images
                                  ? "https://peditz.sfo3.digitaloceanspaces.com/" +
                                    x.images[0]
                                  : ""
                              }
                              alt={x.images ? x.images[0] : ""}
                            />
                          </Box>
                          {x.name}
                        </Flex>
                      </Td>
                      <Td>
                        {" "}
                        <HStack maxW="150px">
                          <Button
                            onClick={() =>
                              decProduct({
                                price: Number(x.price),
                                totalPrice: Number(x.price),
                                amount: 1,
                                name: x.name,
                                id: x.id as string,
                              })
                            }
                            size="sm"
                          >
                            -
                          </Button>
                          <Input
                            value={
                              productsToLauch.find((y) => y.id === x.id)
                                ?.amount || 0
                            }
                            size="sm"
                          />
                          <Button
                            onClick={() =>
                              addProduct({
                                price: Number(x.price),
                                totalPrice: Number(x.price),
                                amount: 1,
                                name: x.name,
                                id: x.id as string,
                              })
                            }
                            size="sm"
                          >
                            +
                          </Button>
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
          <FormControl mt={4} justifyContent="center" alignItems="center">
            <FormLabel htmlFor="pofsale">Observação</FormLabel>
            <Textarea />
          </FormControl>
        </ModalBody>

        <ModalFooter justifyContent="space-between">
          <Button variant="outline" colorScheme="red" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            isLoading={loadSave}
            onClick={sendIfoodAuth}
            colorScheme="blue"
            disabled={productsToLauch.length === 0}
          >
            Lançar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
