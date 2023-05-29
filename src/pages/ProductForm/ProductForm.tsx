import { DeleteIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  chakra,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  Icon,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  SimpleGrid,
  Spacer,
  Switch,
  Table,
  TableContainer,
  Tbody,
  Td,
  Textarea,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FaCamera, FaPlus } from "react-icons/fa";
import IntlCurrencyInput from "react-intl-currency-input";
import { useNavigate } from "react-router-dom";
import "react-tagsinput/react-tagsinput.css";
import { AdditionaisForm } from "../../components/AdditionaisForm";
import { AddNewIngredientModal } from "../../components/AddNewIngredientModal";
import { Card } from "../../components/Card";
import { CropModal } from "../../components/CropModalBlob/CropModal";
import { ProductCategorySelectInput } from "../../components/ProductCategorySelectInput";
import api from "../../services/api";
import {
  AditionalProps,
  FormulaAdditional,
  ProductCategory,
  ProductProps,
  SelectedRow,
  TypesAdditional,
} from "../../types";
import { currencyConfig } from "../../utils/currency";
import "./style.css";

export const ProductForm: React.FC = () => {
  const navigate = useNavigate();
  const [aditionais, setAditionais] = useState<AditionalProps[]>([]);
  const [categoriesList, setCategoriesList] = useState<ProductCategory[]>([]);

  const [product, setProduct] = useState<ProductProps>({
    listed: false,
  } as ProductProps);
  const [additionaisType, setAdditionaisType] = useState<TypesAdditional[]>([]);
  const [formulas, setFormulas] = useState<FormulaAdditional[]>([]);

  const [load, setLoad] = useState(false);
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedRows, setSelectedRows] = useState<SelectedRow[]>([]);

  function handleCheckboxChange(event: any, item: any) {
    if (event.target.checked) {
      setSelectedRows([
        ...selectedRows,
        {
          ingredientId: item.id,
          measure: "",
        },
      ]);
    } else {
      setSelectedRows(selectedRows.filter((l) => l.ingredientId !== item.id));
    }
  }

  function getAllIngredients() {
    setLoad(true);
    api
      .get(`/api/ingredients`)
      .then((response) => {
        setIngredients(response.data);
        setSearchResults(response.data);
      })
      .catch((error) => {
        toast({
          title: error.message,
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
    api.get("api/categories/products").then((response) => {
      setCategoriesList(response.data);
    });
    api.get("api/type/complement").then((response) => {
      setAdditionaisType(response.data);
    });
    api.get("api/formula/complement").then((response) => {
      setFormulas(response.data);
    });

    getAllIngredients();
  }, []);

  useEffect(() => {
    setSearchResults(
      ingredients.filter((ingredient) =>
        ingredient.title.toLowerCase().includes(searchText.toLowerCase())
      )
    );
  }, [ingredients, searchText]);

  function addAdDitional() {
    let obj = {
      title: "",
      seePrice: false,
      order: 0,
      description: "",
      minimumAmount: 0,
      maximumAmount: 0,
      complementType: "",
      complementFormula: "",
      complementItems: [],
    };
    setAditionais([...aditionais, obj]);
  }

  const [image, setImage] = useState<Blob>();
  const [image1, setImage1] = useState<Blob>();
  const [image2, setImage2] = useState<Blob>();
  const toast = useToast();

  function sendProduct(redirect: boolean) {
    const sendObj = product;
    sendObj.complements = aditionais;
    sendObj.establishment = localStorage.getItem("@peditzStore") as string;
    console.log(sendObj);

    if (product.amount === 0) {
      setProduct({ ...product, amount: null });
    }

    const ingredientsData = selectedRows.map((item) => ({
      ingredientId: item.ingredientId,
      measure: "",
    }));

    const data = new FormData();
    data.append("product", JSON.stringify(product));
    data.append("ingredients", JSON.stringify(ingredientsData));
    data.append("files", image as Blob);
    data.append("files", image1 as Blob);
    data.append("files", image2 as Blob);
    setLoad(true);

    if (!product.category) {
      toast({
        title: "Error!",
        description: "Escolha uma categoria",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      setLoad(false);
      return;
    }
    api
      .post("api/products", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
          type: "formData",
        },
      })
      .then(() => {
        toast({
          title: "Produto adicionado!",
          description: "Veja na lista de produtos.",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
        if (redirect) {
          navigate("/produtos");
        } else {
          window.location.reload();
        }
      })
      .catch((err) => {
        toast({
          title: "Error!",
          description: err.message,
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      })
      .finally(() => {
        setLoad(false);
      });
  }

  const [openModalCrop, setOpenModalCrop] = useState(false);
  const [openModalCrop1, setOpenModalCrop1] = useState(false);
  const [openModalCrop2, setOpenModalCrop2] = useState(false);
  const [openModalIngredintSelect, setOpenModalIngredintSelect] =
    useState(false);

  return (
    <Grid gridTemplateColumns={"3fr 1.2fr"} flexDir="row" gap={4} mt={4}>
      <Grid gap={4}>
        <Card>
          <Heading as="h6" size="md">
            Fotos do produto
          </Heading>
          {/* <input type="file" name="" id="" onChange={(event)=> console.log(event.target.value)} /> */}
          <Flex mt={5}>
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
              <>
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
                    onClickCapture={() => {
                      setImage(image1);
                      setImage1(image2);
                      setImage2(undefined);
                    }}
                    icon={<DeleteIcon />}
                    onClick={() => {}}
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
              </>
            )}
            {image && !image1 && (
              <Button
                onClick={() => setOpenModalCrop1(true)}
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
            {image1 && (
              <>
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
                    onClickCapture={() => {
                      setImage1(image2);
                      setImage2(undefined);
                    }}
                    icon={<DeleteIcon />}
                    onClick={() => {}}
                  />
                  <Image
                    w={150}
                    h={150}
                    borderRadius="2xl"
                    shadow="lg"
                    mr={4}
                    src={URL.createObjectURL(image1 as Blob)}
                    alt=""
                  />
                </Box>
              </>
            )}
            {image1 && !image2 && (
              <Button
                onClick={() => setOpenModalCrop2(true)}
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
            {image2 && (
              <>
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
                    onClickCapture={() => {
                      setImage2(undefined);
                    }}
                    size="sm"
                    icon={<DeleteIcon />}
                    onClick={() => {}}
                  />
                  <Image
                    w={150}
                    h={150}
                    borderRadius="2xl"
                    shadow="lg"
                    mr={4}
                    src={URL.createObjectURL(image2 as Blob)}
                    alt=""
                  />
                </Box>
              </>
            )}
          </Flex>
        </Card>
        <Card>
          <Heading as="h6" size="md">
            Informações do produto
          </Heading>
          <SimpleGrid columns={2} minChildWidth="220px" gap={4} mt={4}>
            <FormControl id="nome">
              <FormLabel>Titulo</FormLabel>
              <Input
                name="title"
                type="text"
                autoComplete="title"
                required
                value={product.name}
                onChange={(event) =>
                  setProduct({
                    ...product,
                    name: event.target.value,
                  } as ProductProps)
                }
              />
            </FormControl>
            <FormControl id="nome">
              <FormLabel>Categoria</FormLabel>
              <ProductCategorySelectInput
                categoriesList={categoriesList || []}
                value={product.category?.title}
                onChange={(value: any) => {
                  setProduct({
                    ...product,
                    category: value,
                  } as ProductProps);
                }}
              />
            </FormControl>
            <FormControl id="">
              <FormLabel>Preço</FormLabel>
              <IntlCurrencyInput
                currency="BRL"
                config={currencyConfig}
                className="phoneInput"
                value={product.price}
                onChange={(_event: any, value: number) =>
                  setProduct({ ...product, price: value })
                }
              />
            </FormControl>
            <FormControl id="ean">
              <FormLabel>Código de barra</FormLabel>
              <Input
                name="ean"
                type="text"
                autoComplete="ean"
                required
                value={product.ean}
                onChange={(event) =>
                  setProduct({
                    ...product,
                    ean: event.target.value,
                  } as ProductProps)
                }
              />
            </FormControl>
            <FormControl id="serves">
              <FormLabel htmlFor="serves">Serve quantas pessoas?</FormLabel>
              <NumberInput
                defaultValue={0}
                clampValueOnBlur={false}
                isRequired
                min={0}
                value={product.servesPeople}
                onChange={(event) =>
                  setProduct({
                    ...product,
                    servesPeople: Number(event),
                  } as ProductProps)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
            <FormControl id="timeprepare">
              <FormLabel>Tempo de preparo em minutos</FormLabel>
              <NumberInput
                defaultValue={0}
                clampValueOnBlur={false}
                isRequired
                value={product.preparationTime}
                min={0}
                onChange={(event) =>
                  setProduct({
                    ...product,
                    preparationTime: Number(event),
                  } as ProductProps)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
            <FormControl id="nome">
              <FormLabel>Seu produto será listado?</FormLabel>
              <Switch
                size="lg"
                isChecked={product.listed}
                onChange={(event) =>
                  setProduct({
                    ...product,
                    listed: event.target.checked,
                  } as ProductProps)
                }
              />
            </FormControl>
            <FormControl id="nome">
              <FormLabel>Este produto está ativo?</FormLabel>
              <Switch
                size="lg"
                isChecked={product.active}
                onChange={(event) =>
                  setProduct({
                    ...product,
                    active: event.target.checked,
                  } as ProductProps)
                }
              />
            </FormControl>
            <FormControl id="nome">
              <FormLabel>Gerenciar estoque?</FormLabel>
              <Switch
                size="lg"
                isChecked={product.manageStock}
                onChange={(event) =>
                  setProduct({
                    ...product,
                    manageStock: event.target.checked,
                  } as ProductProps)
                }
              />
            </FormControl>
            <FormControl id="nome">
              <FormLabel>Estoque Mínimo</FormLabel>
              <NumberInput
                defaultValue={0}
                clampValueOnBlur={false}
                isDisabled={!product.manageStock}
                isRequired
                min={0}
                value={product.minimumStock ? product.minimumStock : 0}
                onChange={(event) =>
                  setProduct({
                    ...product,
                    minimumStock: Number(event),
                  } as ProductProps)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
          </SimpleGrid>
          <FormControl id="nome" mt={4}>
            <FormLabel>Descrição</FormLabel>
            <Textarea
              name="nome"
              autoComplete="name"
              value={product.description}
              onChange={(event) =>
                setProduct({
                  ...product,
                  description: event.target.value,
                } as ProductProps)
              }
            />
          </FormControl>
        </Card>
        <Card>
          <Heading as="h6" size="md" mb={4}>
            Criar grupo de complementos
          </Heading>
          <AdditionaisForm
            aditionais={aditionais}
            onChangeAditionais={setAditionais}
            additionaisType={additionaisType}
            formulas={formulas}
          />

          <Button
            variant="outline"
            mt="4"
            isFullWidth
            borderStyle="dashed"
            colorScheme="whatsapp"
            onClick={addAdDitional}
          >
            Adicionar grupo de complementos
          </Button>
        </Card>
        <Card>
          <Heading as="h6" size="md" mb={4}>
            Ingredientes do produto
          </Heading>
          <Flex mb="7">
            <Button
              leftIcon={<FaPlus />}
              colorScheme="green"
              variant="solid"
              onClick={() => setOpenModalIngredintSelect(true)}
            >
              Adicionar novo ingrediente
            </Button>
            <Spacer />
            <chakra.form action="">
              <InputGroup w="320px">
                <InputLeftElement
                  pointerEvents="none"
                  children={<SearchIcon color="gray.300" />}
                />
                <Input
                  type="text"
                  placeholder="Procurar ingrediente..."
                  background="white"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </InputGroup>
            </chakra.form>
          </Flex>
          <TableContainer>
            <Table variant="simple" shadow="md" size="sm">
              <Thead>
                <Tr>
                  <Th>
                    <Checkbox colorScheme="green"></Checkbox>
                  </Th>
                  <Th>Nome</Th>
                  <Th>Código de barras</Th>
                  <Th>Unidade de medidas</Th>
                  <Th>Medidas</Th>
                  <Th>Estoque mínimo</Th>
                </Tr>
              </Thead>
              <Tbody>
                {searchResults.map((ingredient) => (
                  <Tr key={ingredient.id}>
                    <Td>
                      <Checkbox
                        colorScheme="green"
                        onChange={(e) => handleCheckboxChange(e, ingredient)}
                        isChecked={selectedRows.some(
                          (l) => l.ingredientId === ingredient.id
                        )}
                      />
                    </Td>
                    <Td>{ingredient.title}</Td>
                    <Td>{ingredient.ean}</Td>
                    <Td>{ingredient.unitMeasure.unit}</Td>
                    <Td>
                      <Input
                        htmlSize={4}
                        width="auto"
                        size="sm"
                        variant="filled"
                      />
                    </Td>
                    <Td>{ingredient.minimumStock}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Card>
        <Flex justifyContent="end" mt={4}>
          <Button
            colorScheme="blue"
            mr={4}
            size="lg"
            isLoading={load}
            variant="solid"
            onClick={() => sendProduct(false)}
          >
            Salvar e adicionar outro
          </Button>
          <Button
            colorScheme="green"
            size="lg"
            isLoading={load}
            variant="solid"
            onClick={() => sendProduct(true)}
          >
            Adicionar produto
          </Button>
        </Flex>
      </Grid>
      <CropModal
        onSave={(value) => setImage(value as Blob)}
        open={openModalCrop}
        onCloseModal={() => setOpenModalCrop(false)}
      />
      <CropModal
        onSave={(value) => setImage1(value as Blob)}
        open={openModalCrop1}
        onCloseModal={() => setOpenModalCrop1(false)}
      />
      <CropModal
        onSave={(value) => setImage2(value as Blob)}
        open={openModalCrop2}
        onCloseModal={() => setOpenModalCrop2(false)}
      />
      <AddNewIngredientModal
        open={openModalIngredintSelect}
        onSave={() => {
          setOpenModalIngredintSelect(false);
          getAllIngredients();
        }}
        onCloseModal={() => setOpenModalIngredintSelect(false)}
      />
    </Grid>
  );
};
