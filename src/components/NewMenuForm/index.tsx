import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  Input,
  Image,
  FormControl,
  FormLabel,
  Checkbox,
  CheckboxGroup,
  Flex,
  Grid,
  Heading,
  Icon,
  IconButton,
  Box,
  InputGroup,
  InputRightElement,
  useToast,
  Avatar,
} from "@chakra-ui/react";
import { DeleteIcon, SearchIcon } from "@chakra-ui/icons";
import { FaCamera } from "react-icons/fa";
import { FormEvent, useState, useEffect } from "react";

import api from "../../services/api";
import { Card } from "../Card";
import { CropModal } from "../CropModalBlob/CropModal";
import { CardLoadSkeleton } from "../CardLoadSkeleton";
import { useNavigate } from "react-router-dom";
import { MdOutlineNoPhotography } from "react-icons/md";

interface IProduct {
  id: string;
  name: string;
  images?: string[];
  description: string;
  price: string;
}

interface ISalePoint {
  id: string;
  image?: {
    link: string;
  };
  name: string;
}

export function MenuForm() {
  const navigate = useNavigate();
  const [loadingProducts, setLoadProducts] = useState(false);
  const [loadingPoints, setLoadPoints] = useState(false);
  const toast = useToast();
  const [menuProducts, setMenuProducts] = useState<Array<IProduct>>([]);
  const [filtered, setFiltered] = useState<Array<IProduct>>([]);
  const [pointSales, setPointSales] = useState<Array<ISalePoint>>([]);

  const [image, setImage] = useState<Blob>();
  const [productsRequest, setProductsRequest] = useState<Array<string>>([]);
  const [load, setLoad] = useState(false);
  const [salesPointsRequest, setSalesPointsRequest] = useState<Array<string>>(
    []
  );
  const [menuTitleRequest, setMenuTitleRequest] = useState("");
  // const [photoRequest, setPhotoRequest] = useState("");
  const [openModalCrop, setOpenModalCrop] = useState(false);

  function getProducts() {
    setLoadProducts(true);
    api
      .get("/api/products")
      .then((response) => {
        setMenuProducts(response.data);
        setFiltered(response.data);
        console.log(response.data[0]);
      })
      .catch((err) => {
        // if (err.response.data.statusCode === 401) {
        //   logout();
        // }
        console.error(err);
      })
      .finally(() => {
        setLoadProducts(false);
      });
  }

  function getSalesPoints() {
    setLoadPoints(true);
    api
      .get("/api/point-of-sale")
      .then((response) => {
        setPointSales(response.data);
        console.log(response.data);
      })
      .catch((err) => {})
      .finally(() => {
        setLoadPoints(false);
      });
  }

  function parsePrice(price: string) {
    const newPrice = parseInt(price);
    return newPrice.toLocaleString("pt-br", {
      style: "currency",
      currency: "BRL",
    });
  }

  function sendNewMenu(e: FormEvent) {
    e.preventDefault();
    if (!menuTitleRequest) {
      toast({
        title: "Preencha o titulo do cardapio!",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }
    const newMenu = {
      title: menuTitleRequest,
      active: true,
      productsIds: productsRequest,
      pointsOfSaleIds: salesPointsRequest,
    };
    const data = new FormData();
    data.append("catalog", JSON.stringify(newMenu));
    data.append("file", image as Blob);
    setLoad(true);
    api
      .post("/api/catalogs", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
          type: "formData",
        },
      })
      .then((response) => {
        console.log(response.data);
        toast({
          title: "Cardapio criado com sucesso!",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
        navigate("/cardapios");
      })
      .catch((err) => {
        console.log(err);
        toast({
          title: "Erro ao criar cardapio!",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      })
      .finally(() => {
        setLoad(false);
      });
  }

  useEffect(() => {
    getProducts();
    getSalesPoints();
  }, []);

  function searchProducts(search: string) {
    if (search.length > 3) {
      const filteredProducts = menuProducts.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      );
      setFiltered(filteredProducts);
    } else {
      setFiltered(menuProducts);
    }
  }

  return (
    <Grid gap={5}>
      <Card>
        <Flex flexDirection="column" gap={3}>
          <Heading as="h6" size="sm">
            Foto do Cardápio
          </Heading>
          {!image && (
            <Button
              onClick={() => setOpenModalCrop(true)}
              borderColor="gray.400"
              borderStyle="dashed"
              borderWidth="3px"
              display="flex"
              textAlign="center"
              fontWeight="bold"
              color="gray.400"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              borderRadius="2xl"
              height={150}
              w={150}
            >
              <Icon
                as={FaCamera}
                mb={2}
                size="xl"
                fontSize="3xl"
                color="gray.400"
              />
              Selecione uma <br /> imagem
            </Button>
          )}
          {image && (
            <Flex justifyContent="flex-start">
              <Box pos="relative">
                <IconButton
                  pos="absolute"
                  aria-label="del-variant"
                  colorScheme="red"
                  variant="solid"
                  borderRadius="full"
                  shadow="lg"
                  right="1"
                  top="-3"
                  size="sm"
                  icon={<DeleteIcon />}
                  onClick={() => {
                    setImage(undefined);
                  }}
                />
                <Image
                  w={150}
                  h={150}
                  borderRadius="2xl"
                  shadow="lg"
                  mr={4}
                  src={URL.createObjectURL(image as Blob)}
                  alt=""
                />
              </Box>
            </Flex>
          )}
        </Flex>
      </Card>
      <Flex flexDirection="column" gap={3}>
        <Card>
          <FormControl justifyContent="center" alignItems="center">
            <FormLabel>Nome do cardápio</FormLabel>
            <Input
              maxWidth={360}
              name="title"
              type="text"
              autoComplete="title"
              required
              value={menuTitleRequest}
              onChange={(e) => setMenuTitleRequest(e.target.value)}
            />
          </FormControl>
        </Card>
        <Card>
          <Flex mb={4}>
            <InputGroup size="md" w={300}>
              <Input
                placeholder="Buscar produtos"
                onChange={(e) => searchProducts(e.target.value)}
              />
              <InputRightElement width="3.5rem">
                <Button h="1.75rem" size="sm">
                  <SearchIcon />
                </Button>
              </InputRightElement>
            </InputGroup>
          </Flex>
          <TableContainer maxWidth="100vw">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>produto</Th>
                  <Th>descrição</Th>
                  <Th isNumeric>preço</Th>
                </Tr>
              </Thead>
              <Tbody>
                {loadingProducts && <CardLoadSkeleton />}
                {filtered.length > 0 &&
                  !loadingProducts &&
                  filtered.map((prod, index) => {
                    return (
                      <Tr>
                        <Td>
                          <Checkbox
                            size="md"
                            colorScheme="green"
                            key={prod.id}
                            flexDirection="row"
                            value={prod.id}
                            defaultChecked={productsRequest.includes(prod.id)}
                            checked={productsRequest.includes(prod.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setProductsRequest((prev) => [
                                  ...prev,
                                  prod.id,
                                ]);
                              } else if (!e.target.checked) {
                                setProductsRequest((prev) =>
                                  prev.filter((item) => item !== prod.id)
                                );
                              }
                            }}
                          >
                            <Flex alignItems="center" gap={4}>
                              <Avatar
                                src={
                                  prod.images
                                    ? "https://peditz.sfo3.digitaloceanspaces.com/" +
                                      prod.images[0]
                                    : ""
                                }
                                bg="gray.300"
                                size={"sm"}
                                icon={
                                  <MdOutlineNoPhotography fontSize="1.2rem" />
                                }
                              />
                              {/* <Image
                                alt={`${prod.name} image`}
                                maxWidth="30px"
                                maxHeight="30px"
                                borderRadius="full"
                                boxSize="100%"
                              /> */}
                              {prod.name}
                            </Flex>
                          </Checkbox>
                        </Td>
                        <Td>{prod.description}</Td>
                        <Td>
                          <Flex justifyContent="flex-end">
                            {parsePrice(prod.price)}
                          </Flex>
                        </Td>
                      </Tr>
                    );
                  })}
              </Tbody>
            </Table>
          </TableContainer>
        </Card>
        <Card>
          <CheckboxGroup>
            <FormLabel>Pontos de venda</FormLabel>
            {loadingPoints && <CardLoadSkeleton />}
            {pointSales.length > 0 &&
              !loadingPoints &&
              pointSales.map((point, index) => {
                return (
                  <Flex justifyContent="space-between">
                    <Checkbox
                      size="md"
                      colorScheme="green"
                      key={point.id}
                      flexDirection="row"
                      value={point.id}
                      onChange={(e) => {
                        if (e.target.checked) {
                          const alreadyAdd = salesPointsRequest.find(
                            (point) => {
                              return point === e.target.value;
                            }
                          );
                          if (!alreadyAdd) {
                            salesPointsRequest.push(e.target.value);
                          }
                        } else if (!e.target.checked) {
                          salesPointsRequest.find((point, index) => {
                            if (point === e.target.value) {
                              const newArray = salesPointsRequest;
                              newArray.splice(index, 1);
                              setSalesPointsRequest(newArray);
                            }
                          });
                        }
                      }}
                    >
                      {point.name}
                    </Checkbox>
                  </Flex>
                );
              })}
          </CheckboxGroup>
        </Card>
      </Flex>
      <Flex gap={4}>
        <Button
          onClick={() => {
            navigate("/cardapios");
          }}
          variant="outline"
          colorScheme="red"
        >
          Cancelar
        </Button>
        <Button onClick={sendNewMenu} isLoading={load} colorScheme="blue">
          Salvar
        </Button>
      </Flex>
      <CropModal
        onSave={(value) => setImage(value as Blob)}
        open={openModalCrop}
        onCloseModal={() => setOpenModalCrop(false)}
      />
    </Grid>
  );
}
