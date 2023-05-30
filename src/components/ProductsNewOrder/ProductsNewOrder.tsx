import { useState, useEffect, useContext, useRef, LegacyRef } from "react";
import {
  Button,
  Flex,
  Box,
  Image,
  Text,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Radio,
  RadioGroup,
  Stack,
  SimpleGrid,
  Textarea,
} from "@chakra-ui/react";

import CartContext from "../../contexts/CartProducts";

import api from "../../services/api";
import { currency } from "../../utils/currency";
import { IProductCart } from "../../pages/CreateNewOrder/CreateNewOrder";
import { EmptyBox } from "../EmptyBox";

interface IProductsNewOrderProps {
  cartProducts: IProductCart[];
  setCartProducts: (value: IProductCart[]) => void;
}
interface Images {
  link: string;
  ref: string;
}

interface IProduct {
  id: string;
  description: string;
  images: Images[];
  name: string;
  price: number;
}

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
interface Order {
  pointOfSaleId: string;
  commandId: string;
  delivery: boolean;
  obs: string;
  products: ProductToSend[];
}
interface ICategory {
  id: string;
  products: IProduct[];
  title: string;
}

interface Itens {
  id: string;
  maximumAmount: number;
  minimumAmount: number;
  order: number;
  price: number;
  title: string;
}

interface IComplements {
  formula: string;
  id: string;
  itens: Itens[];
  maximumAmount: number;
  minimumAmount: number;
  order: number;
  title: string;
  type: string;
}

interface IResponseProduct {
  complement: IComplements[];
}

interface Props {
  onAddCart: (prod: ProductToSend[]) => void;
  cart: ProductToSend[];
}

export function ProductsNewOrder({ onAddCart, cart }: Props) {
  const btnRef = useRef(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [itemComplements, setItemComplements] = useState<IComplements[]>([]);
  // const [cartProducts, setCartProducts] = useState<IProductCart[]>([]);
  const { cartProducts, setCartProducts } = useContext(CartContext);
  const [name, setName] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<ProductToSend>();
  const [obs, setObs] = useState("");
  useEffect(() => {
    api
      .get("/api/products/category")
      .then((response) => {
        setCategories(response.data);
        // const allProducts: IProduct[] = [];
        // categories.forEach((cat) => {
        //   cat.products.forEach((prod) => {
        //     allProducts.push(prod);
        //   });
        // });
        // setProducts(allProducts);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [products]);

  const filterProducts = (category: string) => {
    const filtered = categories.filter((cat) => {
      return cat.id === category;
    });
    setProducts(filtered[0].products);
  };

  async function openDrawer(prod: IProduct) {
    onOpen();
    setSelectedProduct({
      productId: prod.id,
      amount: 1,
      complements: [],
      name: prod.name,
      price: prod.price,
      obs: "",
    });
    // api.get(`api/products/${prod.id}`).then((response) => {
    //   const complements: IResponseProduct = response.data;
    //   if (complements.complement.length > 0) {
    //     onOpen();
    //     setItemComplements(complements.complement);
    //   } else {
    //     console.log(prod);
    //     const copy = [...cart];
    //     const productIndex = copy.findIndex(
    //       (item) => item.productId === prod.id,
    //     );
    //     if (productIndex > -1) {
    //       copy[productIndex].amount = copy[productIndex].amount + 1;
    //     } else {
    //       copy.push({
    //         productId: prod.id,
    //         amount: 1,
    //         complements: [],
    //         name: prod.name,
    //         price: prod.price,
    //         obs: "",
    //       });
    //     }
    //     onAddCart([...copy]);
    //   }
    // });
  }

  const addToCart = () => {
    if (selectedProduct) {
      const copy = [...cart];
      const productIndex = copy.findIndex(
        (item) =>
          item.productId === selectedProduct.productId &&
          item.obs === selectedProduct.obs
      );
      if (productIndex > -1) {
        copy[productIndex].amount = copy[productIndex].amount + 1;
      } else {
        copy.push({
          productId: selectedProduct.productId,
          amount: selectedProduct.amount,
          complements: [],
          name: selectedProduct.name,
          price: selectedProduct.price,
          obs: obs,
        });
      }
      onAddCart([...copy]);
      setSelectedProduct(undefined);
      setObs("");
      onClose();
    }
    onClose();
  };

  return (
    <>
      <Flex
        background={"white"}
        borderRadius={"10px"}
        flexDirection={"column"}
        p={4}
        gap={4}
      >
        <Box h={"60px"} display={"flex"} gap={4} alignItems={"center"}>
          {categories.map((category: ICategory) => {
            return (
              <Box
                display="flex"
                alignItems="center"
                flexDirection="column"
                key={category.id}
                onClick={() => filterProducts(category.id)}
              >
                <Box
                  w="50px"
                  h="50px"
                  borderRadius="full"
                  boxShadow="xs"
                  cursor="pointer"
                >
                  <Image
                    src={
                      category.products[0].images[0]?.link ||
                      "data:image/png;base64,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"
                    }
                    borderRadius="full"
                    boxSize="100%"
                  />
                </Box>
                <Text fontSize="14px"> {category.title} </Text>
              </Box>
            );
          })}
        </Box>
        <SimpleGrid
          minChildWidth="120px"
          flexWrap="wrap"
          gap={4}
          h="80%"
          justifyContent="start"
          maxW="400px"
        >
          {!products[0] ? (
            <EmptyBox
              title="Nenhuma categoria selecionada"
              description="Escolha alguma categoria acima"
            />
          ) : (
            products.map((prod) => {
              return (
                <>
                  <Button
                    // key={prod.id}
                    borderRadius="7px"
                    boxShadow="md"
                    cursor="pointer"
                    onClick={() => {
                      openDrawer(prod);
                    }}
                    display="flex"
                    flexDirection="column"
                    justifyContent="flex-start"
                    padding={0}
                    minH="180px"
                  >
                    <Box
                      borderRadius="7px 7px 0px 0px"
                      width="100%"
                      height="100px"
                      minH="120px"
                      overflow="hidden"
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Image
                        src={
                          prod.images[0]?.link ||
                          "data:image/png;base64,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"
                        }
                        width="100%"
                      />
                    </Box>
                    <Text
                      fontSize="13px"
                      wordBreak="break-word"
                      mt="3px"
                      fontWeight="bold"
                      overflowWrap="break-word"
                      whiteSpace="pre-wrap"
                    >
                      {prod.name}
                    </Text>
                    <Text fontSize="14px" ml="7px" fontWeight="bold">
                      <strong>{currency(prod.price)}</strong>
                    </Text>
                  </Button>
                </>
              );
            })
          )}
        </SimpleGrid>
      </Flex>
      <Drawer
        // key={prod.id}
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{selectedProduct?.name}</DrawerHeader>
          <DrawerBody>
            {itemComplements.map((comp) => {
              return (
                <>
                  <Box
                    key={comp.id}
                    w="100%"
                    h="50px"
                    p="10px"
                    mb="10px"
                    background="#ecf1f6"
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                  >
                    <Text fontWeight="bold">{comp.title}</Text>
                    <Text fontSize="13px">
                      {comp.type === "Radio" && "Selecione uma opção"}
                    </Text>
                  </Box>
                  <RadioGroup
                  // onChange={setValue} value={value}
                  >
                    <Stack direction="column">
                      {itemComplements.length > 0 &&
                        comp.itens.map((item) => {
                          return (
                            <Radio
                              p="3px"
                              value={item.id}
                              display="flex"
                              justifyContent="space-between"
                              flexDirection="row-reverse"
                            >
                              {item.title}
                            </Radio>
                          );
                        })}
                    </Stack>
                  </RadioGroup>
                </>
              );
            })}
            <Textarea
              placeholder="Observações"
              mt="10px"
              h="100px"
              resize="none"
              onChange={(e) => setObs(e.target.value)}
            />
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={() => addToCart()}>
              Adicionar ao pedido
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
