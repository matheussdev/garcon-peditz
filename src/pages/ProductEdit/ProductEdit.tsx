import { DeleteIcon, SearchIcon } from "@chakra-ui/icons"
import {
  Box,
  FormControl,
  Button, Flex,
  FormLabel,
  Grid,
  Heading,
  Icon,
  IconButton,
  Image,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  SimpleGrid,
  Switch,
  Textarea, useToast, Spacer, chakra, InputGroup, InputLeftElement, TableContainer, Table, Thead, Tr, Th, Checkbox, Tbody, Td
} from "@chakra-ui/react"
import React, { FormEvent, useCallback, useEffect, useState } from "react"
import { FaCamera, FaPlus } from "react-icons/fa"
import IntlCurrencyInput from "react-intl-currency-input"
import { useNavigate, useParams } from "react-router-dom"
import "react-tagsinput/react-tagsinput.css"
import { AdditionaisForm } from "../../components/AdditionaisForm"
import { AddNewIngredientModal } from "../../components/AddNewIngredientModal"
import { Card } from "../../components/Card"
import { CropModal } from "../../components/CropModalBlob/CropModal"
import { ProductCategorySelectInput } from "../../components/ProductCategorySelectInput"
import api from "../../services/api"
import {
  AditionalProps,
  FormulaAdditional,
  ProductProps,
  SelectedRow,
  TypesAdditional
} from "../../types"
import "./style.css"

const currencyConfig = {
  locale: "pt-BR",
  formats: {
    number: {
      BRL: {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
    },
  },
};

export const ProductEdit: React.FC = () => {
  const { productID } = useParams();
  const [aditionais, setAditionais] = useState<AditionalProps[]>([]);
  const [categoriesList, setCategoriesList] = useState<
    { id: string; title: string }[]
  >([]);
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
  const [product, setProduct] = useState<ProductProps>({
    listed: false,
  } as ProductProps);
  const toast = useToast();
  const navigate = useNavigate();
  const [additionaisType, setAdditionaisType] = useState<TypesAdditional[]>([]);
  const [formulas, setFormulas] = useState<FormulaAdditional[]>([]);
  const [image, setImage] = useState({ link: "", ref: "" });
  const [image1, setImage1] = useState({ link: "", ref: "" });
  const [image2, setImage2] = useState({ link: "", ref: "" });
  const [load, setLoad] = useState(false);
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [openModalIngredintSelect, setOpenModalIngredintSelect] = useState(false);
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
      setSelectedRows(selectedRows.filter((l) => l.ingredientId !== item.ingredientId));
    }
  }
  
  const initialGet = useCallback(() => {
    api.get("api/categories/products").then((response) => {
      setCategoriesList(response.data);
    });
    api.get("api/type/complement").then((response) => {
      setAdditionaisType(response.data);
    });
    api.get("api/formula/complement").then((response) => {
      setFormulas(response.data);
    });
  }, []);

  // function getAllIngredients() {
  //   setLoad(true);
  //   api
  //     .get(`/api/ingredients`)
  //     .then((response) => {
  //       setIngredients(response.data);
  //       setSearchResults(response.data);
  //     })
  //     .catch((error) => {
  //       toast({
  //         title: error.message,
  //         status: "error",
  //         duration: 4000,
  //         isClosable: true,
  //       });
  //     })
  //     .finally(() => {
  //       setLoad(false);
  //     });
  // }

  const initialGetProduct = useCallback(() => {
    api.get(`api/products/${productID}`).then((response) => {
      const obj = response.data;
      setProduct({
        ...obj,
        category: obj.category,
        servesPeople: obj.servesPeople,
      });
      if (obj.images) {
        setImage(obj?.images[0] ? obj?.images[0] : { link: "", ref: "" });
        setImage1(obj?.images[1] ? obj?.images[1] : { link: "", ref: "" });
        setImage2(obj?.images[2] ? obj?.images[2] : { link: "", ref: "" });
      }
      let additionais = obj.complement;
      additionais = additionais.map((x: any) => ({
        ...x,
        complementType: x.complementType.id,
        complementFormula: x.complementFormula.id,
      }));
      setAditionais([...additionais]);
    });
  }, [productID]);

  useEffect(() => {
    initialGet();
    initialGetProduct();
    // getAllIngredients();
  }, [initialGet, initialGetProduct]);

  useEffect(() => {
    setSearchResults(
      ingredients.filter(
        (ingredient) =>
          ingredient.title.toLowerCase().includes(searchText.toLowerCase())
      )
    );
  }, [ingredients, searchText]);

  const [openModalCrop, setOpenModalCrop] = useState(false);
  const [openModalCrop1, setOpenModalCrop1] = useState(false);
  const [openModalCrop2, setOpenModalCrop2] = useState(false);

  function sendPhoto(value: Blob) {
    const dataToSend = new FormData();

    dataToSend.append("file", value as Blob);
    setLoad(true);
    api
      .post(`/api/products/${productID}/images`, dataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
          type: "formData",
        },
      })
      .then((respons) => initialGetProduct())
      .finally(() => setLoad(false));
  }

  function sendPhoto1(value: Blob) {
    const dataToSend = new FormData();
    dataToSend.append("file", value as Blob);
    setLoad(true);

    api
      .post(`/api/products/create/image/${productID}`, dataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
          type: "formData",
        },
      })
      .then((respons) => initialGetProduct())
      .finally(() => setLoad(false));
  }

  function sendPhoto2(value: Blob) {
    const dataToSend = new FormData();
    dataToSend.append("file", value as Blob);
    setLoad(true);

    api
      .post(`/api/products/create/image/${productID}`, dataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
          type: "formData",
        },
      })
      .then((respons) => initialGetProduct())
      .finally(() => setLoad(false));
  }

  function sendInformation(e: FormEvent) {
    e.preventDefault();
    setLoad(true);
    const ingredientsData = selectedRows.map((item) => ({
      ingredientId: item.ingredientId,
      measure: "",
    }));
    api
      .patch(`/api/products/${productID}`, {
        name: product.name,
        description: product.description,
        price: product.price,
        order: product.order,
        active: product.active,
        amount: product.amount,
        preparationTime: product.preparationTime,
        listed: product.listed,
        note: product.note,
        servesPeople: product.servesPeople,
        category: product.category?.title,
        complements: aditionais,
        manageStock: product.manageStock,
        ean: product.ean,
        ingredients: ingredientsData,
      })
      .then((response) => {
        const obj = response.data;
        setProduct({
          ...obj,
          category: obj.category,
          servesPeople: obj.servesPeople,
        });

        if (obj.images) {
          setImage(obj?.images[0] ? obj?.images[0] : { link: "", ref: "" });
          setImage1(obj?.images[1] ? obj?.images[1] : { link: "", ref: "" });
          setImage2(obj?.images[2] ? obj?.images[2] : { link: "", ref: "" });
        }
        
        let additionais = obj.additional;
        if (additionais && additionais.length > 0) {
          additionais = additionais.map((x: any) => ({
            ...x,
            additionalType: x.additionalType.id,
            additionalFormula: x.additionalFormula.id,
          }));
        }
        setAditionais(additionais || []);
        navigate("/produtos");
        toast({
          title: "Informações editadas!",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
      })
      .catch(() => {
        toast({
          title: "Ocorreu um erro ao editar!",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      })
      .finally(() => {
        setLoad(false);
      });
  }
  return (
    <Grid gridTemplateColumns={"3fr 1.2fr"} flexDir="row" gap={4} mt={4}>
      <Grid gap={4}>
        <Card>
          <Heading as="h6" size="md">
            Fotos do produto
          </Heading>
          {/* <input type="file" name="" id="" onChange={(event)=> console.log(event.target.value)} /> */}
          <Flex mt={5}>
            {!image.link && (
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
                disabled={load}
                isLoading={load}
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
            {image.link && (
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
                      api
                        .delete(
                          `api/products/images?imagelink=${image.ref}&productId=${productID}`
                        )
                        .then(() => {
                          setImage(image1);
                          setImage1(image2);
                          setImage2({ link: "", ref: "" });
                        });
                    }}
                    icon={<DeleteIcon />}
                  />
                  <Image
                    w={150}
                    h={150}
                    borderRadius="2xl"
                    shadow="lg"
                    mr={4}
                    src={image.link}
                    alt=""
                  />
                </Box>
              </>
            )}
            {image.link && !image1.link && (
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
                disabled={load}
                isLoading={load}
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
            {image1.link && (
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
                      api
                        .delete(
                          `api/products/images?imagelink=${image.ref}&productId=${productID}`
                        )
                        .then(() => {
                          setImage1(image2);
                          setImage2({ link: "", ref: "" });
                        });
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
                    src={image1.link}
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
                disabled={load}
                isLoading={load}
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
            {image2.link && (
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
                      api
                        .delete(
                          `api/products/image?imagelink=${image.ref}&productId=${productID}`
                        )
                        .then(() => {
                          setImage2({ link: "", ref: "" });
                        });
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
                    src={image2.link}
                    alt=""
                  />
                </Box>
              </>
            )}
          </Flex>
        </Card>
        <Card>
          <form onSubmit={sendInformation}>
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
                    const categoryTitle = {
                      title: value,
                    }
                    setProduct({
                      ...product,
                      category: categoryTitle,
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
                  onChange={(event: any, value: number, maskedValued: string) =>
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
                  value={product.ean}
                  onChange={(event) =>
                    setProduct({
                      ...product,
                      ean: event.target.value,
                    } as ProductProps)
                  }
                />
              </FormControl>
              <FormControl id="nome">
                <FormLabel>Serve quantas pessoas?</FormLabel>
                <NumberInput
                  defaultValue={0}
                  clampValueOnBlur={false}
                  isRequired
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
              <FormControl id="nome">
                <FormLabel>Tempo de preparo em minutos</FormLabel>
                <NumberInput
                  defaultValue={0}
                  clampValueOnBlur={false}
                  isRequired
                  value={product.preparationTime}
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
                value={product.amount ? product.amount : 0}
                onChange={(event) =>
                  setProduct({
                    ...product,
                    amount: Number(event),
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
          </form>
        </Card>

        <Card>
          <Heading as="h6" size="md">
            Criar grupo de complementos
          </Heading>
          <AdditionaisForm
            formulas={formulas}
            onChangeAditionais={setAditionais}
            aditionais={aditionais}
            additionaisType={additionaisType}
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
          <Flex>
            <form
              action=""
              onSubmit={(e) => {
                setProduct({ ...product, complements: aditionais });
                sendInformation(e);
              }}
            >
              <Button
                isLoading={load}
                type="submit"
                colorScheme="green"
                mt="4"
                ms="auto"
              >
                Salvar
              </Button>
            </form>
          </Flex>
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
          <chakra.form
            action=""
          >
            <InputGroup w='320px'>
              <InputLeftElement
                pointerEvents='none'
                children={<SearchIcon color='gray.300' />}
              />
              <Input 
                type='text' 
                placeholder='Procurar ingrediente...'
                background="white"
                value={searchText} 
                onChange={(e) => setSearchText(e.target.value)}
              />
            </InputGroup>
          </chakra.form>
        </Flex>
        <TableContainer>
          <Table variant='simple' shadow="md" size="sm">
            <Thead>
              <Tr>
                <Th>
                  <Checkbox colorScheme='green'></Checkbox>
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
                    colorScheme='green'
                    onChange={(e) => handleCheckboxChange(e, ingredient)}
                    isChecked={selectedRows.some((l) => l.ingredientId === ingredient.id)}
                  />
                </Td>
                <Td>{ingredient.title}</Td>
                <Td>{ingredient.ean}</Td>
                <Td>{ingredient.unitMeasure.unit}</Td>
                <Td>
                  <Input htmlSize={4} width='auto' size='sm' variant='filled'/>
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
            type="submit"
            colorScheme="green"
            size="lg"
            isLoading={load}
            variant="solid"
            onClick={sendInformation}
          >
            Salvar alterações
          </Button>
        </Flex>
      </Grid>

      <CropModal
        onSave={(value) => sendPhoto(value)}
        open={openModalCrop}
        onCloseModal={() => setOpenModalCrop(false)}
      />
      <CropModal
        onSave={(value) => sendPhoto1(value)}
        open={openModalCrop1}
        onCloseModal={() => setOpenModalCrop1(false)}
      />
      <CropModal
        onSave={(value) => sendPhoto2(value)}
        open={openModalCrop2}
        onCloseModal={() => setOpenModalCrop2(false)}
      />
      {/* <AddNewIngredientModal
        open={openModalIngredintSelect}
        onSave={() => {
          setOpenModalIngredintSelect(false);
          getAllIngredients();
        }}
        onCloseModal={() => setOpenModalIngredintSelect(false)}
      /> */}
    </Grid>
  );
};
