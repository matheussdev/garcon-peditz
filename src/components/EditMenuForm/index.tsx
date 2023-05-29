import { FormEvent, useState, useEffect } from "react";
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
  Text,
} from "@chakra-ui/react";
import { DeleteIcon, SearchIcon } from "@chakra-ui/icons";
import { FaCamera } from "react-icons/fa";

import api from "../../services/api";
import { currency } from "../../utils/currency";
import { Card } from "../Card";
import { EmptyBox } from "../EmptyBox";
import { CropModal } from "../CropModalBlob/CropModal";
import { CardLoadSkeleton } from "../CardLoadSkeleton";
import { useNavigate, useParams } from "react-router-dom";
import { MdOutlineNoPhotography } from "react-icons/md";
import { StringLiteral } from "typescript";

interface Images {
  link: string;
  ref: string;
}

interface ICategoryResponse {
  id: string;
  name: string;
}

interface IProduct {
  id: string;
  description: string;
  images: Images[];
  name: string;
  price: number;
  title?: string;
  category?: ICategoryResponse | null;
}

interface ISalePoint {
  id: string;
  image?: {
    link: string;
  };
  name: string;
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

interface IProductQtd {
  id: string | StringLiteral;
  category: string | StringLiteral;
}

interface ICategoryQtd {
  id: string;
  qtd: number;
}

const url =
  "data:image/png;base64,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";

export function EditMenuForm() {
  const { catalogId } = useParams();
  const navigate = useNavigate();
  const [loadingProducts, setLoadProducts] = useState(false);
  const [loadingPoints, setLoadPoints] = useState(false);
  const toast = useToast();
  const [menuProducts, setMenuProducts] = useState<Array<IProduct>>([]);
  const [filtered, setFiltered] = useState<Array<IProduct>>([]);
  const [pointSales, setPointSales] = useState<Array<ISalePoint>>([]);

  const [imageBase, setImageBase] = useState<string>();
  const [image, setImage] = useState<Blob>();
  const [productsRequest, setProductsRequest] = useState<Array<string>>([]);
  const [load, setLoad] = useState(false);
  const [salesPointsRequest, setSalesPointsRequest] = useState<Array<string>>(
    [],
  );
  const [menuTitleRequest, setMenuTitleRequest] = useState("");
  // const [photoRequest, setPhotoRequest] = useState("");
  const [openModalCrop, setOpenModalCrop] = useState(false);

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categoryPhoto, setCategoryPhoto] = useState(url);
  const [actualCategory, setActualCategory] = useState("");

  const [qtdProducts, setQtdProducts] = useState<IProductQtd[]>([]);
  const [qtdCategories, setQtdCategories] = useState<ICategoryQtd[]>([]);

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

  function getCatalog() {
    if (catalogId) {
      api
        .get(`/api/catalogs/${catalogId}`)
        .then((response) => {
          console.log(response.data);
          setMenuTitleRequest(response.data.title);
          setProductsRequest(qtdProducts.map((product: any) => product.id));

          console.log(response.data.pointOfSales.map((point: any) => point.id));
          setSalesPointsRequest(
            response.data.pointOfSales.map((point: any) => point.id),
          );
          setImageBase(response.data.image);
        })
        .catch((err) => {})
        .finally(() => {
          setLoadPoints(false);
        });
    }
  }

  function parsePrice(price: string) {
    const newPrice = parseInt(price);
    return newPrice.toLocaleString("pt-br", {
      style: "currency",
      currency: "BRL",
    });
  }

  function getCategories() {
    api
      .get("/api/products/category")
      .then((response) => {
        setCategories(response.data);
        response.data.forEach((cat: any) => {
          addCategoryQtd(cat.id);
        });
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  const filterProducts = (category: string) => {
    const filtered = categories.filter((cat) => {
      return cat.id === category;
    });
    setProducts(filtered[0].products);
  };

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
    if (image) {
      data.append("image", image);
    }
    setLoad(true);
    api
      .patch(`/api/catalogs/${catalogId}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
          type: "formData",
        },
      })
      .then((response) => {
        console.log(response.data);
        toast({
          title: "Cardapio Editado com sucesso!",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
        navigate("/cardapios");
      })
      .catch((err) => {
        console.log(err);
        toast({
          title: "Erro ao editar cardapio!",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      })
      .finally(() => {
        setLoad(false);
      });
  }

  function addProductsQtd(prodId: string) {
    const newProd = {
      id: prodId,
      category: actualCategory,
    };
    const filter = qtdProducts.filter((prod) => {
      return prod.id === newProd.id;
    });
    console.log(filter.length);
    if (filter.length === 0) {
      setQtdProducts((prev) => [...prev, newProd]);
    }
  }

  function addCategoryQtd(id: string) {
    const newCat = {
      id,
      qtd: 0,
    };
    setQtdCategories((prev) => [...prev, newCat]);
  }

  function getCategoryQtdProducts(categId: string) {
    const filtered = qtdProducts.filter((prod) => {
      return prod.category === categId;
    });
    return filtered.length;
  }

  function filterCategoryQtd() {
    const newArr = [...qtdCategories];
    newArr.forEach((cat) => {
      console.log(cat);
    });
  }

  useEffect(() => {
    getProducts();
    getCategories();
    getSalesPoints();
    getCatalog();

    api
      .get(`/api/catalogs/${catalogId}`)
      .then((response) => {
        // console.log(response.data.products);
        // const arrProds: IProductQtd = []
        // response.data.products.forEach((prod: IProduct) => {
        //   const newProd = {
        //     id: prod.id,
        //     category: prod.category?.id,
        //   };
        //   arrProds.push(newProd);
        // });
        // setQtdProducts(arrProds)
      })
      .catch((error) => {
        console.error(error);
      });

    console.log(actualCategory);
    console.log(qtdCategories);
  }, [catalogId, actualCategory, qtdProducts]);

  function searchProducts(search: string) {
    if (search.length > 3) {
      const filteredProducts = menuProducts.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase()),
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
          {!image && !imageBase && (
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
          {imageBase && !image && (
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
                    setImageBase(undefined);
                  }}
                />
                <Image
                  w={150}
                  h={150}
                  borderRadius="2xl"
                  shadow="lg"
                  mr={4}
                  src={imageBase}
                  alt=""
                />
              </Box>
            </Flex>
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
        <Card display={"flex"} flexDirection={"column"} gap={3}>
          <Flex mb={4}>
            <InputGroup size="md" w={300}>
              <Input
                placeholder="Buscar produtos"
                required
                onChange={(e) => searchProducts(e.target.value)}
              />
              <InputRightElement width="3.5rem">
                <Button h="1.75rem" size="sm">
                  <SearchIcon />
                </Button>
              </InputRightElement>
            </InputGroup>
          </Flex>
          {/* <TableContainer maxWidth="100vw">
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
          </TableContainer> */}
          <Box h={"60px"} display={"flex"} gap={4} alignItems={"center"}>
            {categories.map((category) => {
              return (
                <Box
                  display="flex"
                  alignItems="center"
                  flexDirection="column"
                  key={category.id}
                  onClick={() => {
                    filterProducts(category.id);
                    setActualCategory(category.id);
                    // getCategoryQtdProducts(category.id);
                  }}
                >
                  <Box
                    w="50px"
                    h="50px"
                    borderRadius="full"
                    boxShadow="xs"
                    cursor="pointer"
                    pos="relative"
                  >
                    {getCategoryQtdProducts(category.id) > 0 && (
                      <Box
                        pos="absolute"
                        aria-label="del-variant"
                        bg="green.400"
                        color="white"
                        h="20px"
                        w="20px"
                        borderRadius="full"
                        shadow="lg"
                        right="-1"
                        top="-1"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        {getCategoryQtdProducts(category.id)}
                      </Box>
                    )}
                    <Image
                      src={
                        category.products[0].images[0]?.link || categoryPhoto
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
          {!products[0] ? (
            <EmptyBox
              title="Nenhuma categoria selecionada"
              description="Escolha alguma categoria acima"
            />
          ) : (
            <Flex gap={4}>
              {products.map((prod) => {
                return (
                  <Flex
                    flexDirection="column"
                    w="200px"
                    h="170px"
                    bg="gray.200"
                    borderRadius="7px "
                    boxShadow="md"
                    cursor="pointer"
                    onClick={() => {
                      addProductsQtd(prod.id);
                    }}
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
                      <Image src={prod.images[0]?.link || url} width="100%" />
                    </Box>
                    <Text
                      fontSize="13px"
                      wordBreak="break-word"
                      mt="3px"
                      fontWeight="bold"
                      overflowWrap="break-word"
                      whiteSpace="pre-wrap"
                      ml="10px"
                    >
                      {prod.name}
                    </Text>
                    <Text fontSize="14px" ml="7px" fontWeight="bold">
                      <strong>{currency(prod.price)}</strong>
                    </Text>
                  </Flex>
                );
              })}
            </Flex>
          )}
        </Card>
        <Card>
          <CheckboxGroup
            defaultValue={salesPointsRequest}
            value={salesPointsRequest}
          >
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
                      checked={salesPointsRequest.includes(point.id)}
                      defaultChecked={salesPointsRequest.includes(point.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSalesPointsRequest((prev) => [...prev, point.id]);
                        } else if (!e.target.checked) {
                          setSalesPointsRequest((prev) =>
                            prev.filter((item) => item !== point.id),
                          );
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
          onClick={() => navigate("/cardapios")}
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
