import { EditIcon } from "@chakra-ui/icons";
import {
  Button,
  chakra,
  FormControl,
  FormLabel,
  Image,
  Input,
  SimpleGrid,
  Flex,
  Box,
  Select,
  Textarea,
  InputGroup,
  InputLeftElement,
  InputLeftAddon,
  Icon,
  Grid,
  useMediaQuery,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Card } from "../../../components/Card";
import api from "../../../services/api";

import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { CropModal } from "../../../components/CropModalBlob/CropModal";
import { BiSave } from "react-icons/bi";
import { logout } from "../../../services/auth";
import slugify from "../../../utils/masks";

interface category {
  id: string;
  categoryName: string;
}
interface scheduleProps {
  monday: string[];
  tuesday: string[];
  wednesday: string[];
  thursday: string[];
  friday: string[];
  saturday: string[];
  sunday: string[];
}

interface adressProps {
  complement: string;
  district: string;
  id: string;
  latitude: string;
  longitude: string;
  number: string;
  road: string;
  zipCode: string;
}
interface storeProps {
  image: string;
  openPointOfSale: boolean;
  id: string;
  name: string;
  whatsapp: string;
  slug: string;
  instagram: string;
  description: string;
  schedules: scheduleProps;
  address: adressProps;
  category: { id: string; categoryName: string };
}

interface StoreBioProps {
  store?: storeProps;
}

export function StoreBio({ store }: StoreBioProps) {
  const toast = useToast();
  const [img, setImg] = useState<Blob>();
  const [imgS, setImgS] = useState<string>(store ? store.image : "");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [categoriesList, setCategoriesList] = useState<category[]>([]);

  const [category, setCategory] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [slug, setSlug] = useState<string>("");
  const [whatsapp, setWhatsApp] = useState<string>("");
  const [instagram, setInstagram] = useState<string>("");

  const [isLargerThan1000] = useMediaQuery([
    "(min-width: 1000px)",
    "(max-width: 600px)",
  ]);

  useEffect(() => {
    api
      .get("api/categories/point-of-sale")
      .then((response) => {
        setCategoriesList(response.data);
      })
      .catch((err) => {
        console.error(err);
        if (err.response.data.statusCode === 401) {
          logout();
        }
      });
  }, []);

  function handleEdit() {
    const data = new FormData();
    data.append(
      "pointOfSale",
      JSON.stringify({
        pointOfSaleId: store?.id,
        openPointOfSale: store?.openPointOfSale,
        name,
        category,
        description,
        slug,
        whatsapp,
        instagram,

      })
    );
    data.append("file", img as Blob);

    api
      .patch(`api/point-of-sale/`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
          type: "formData",
        },
      })
      .then((response) => {
        toast({
          title: "Pagina editada com sucesso!",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
      })
      .catch((err) => {
        toast({
          title: "Error!",
          description: "Houve um error ao tentar editar sua pagina!",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
        console.log(err);
      });
  }

  useEffect(() => {
    setDescription(store ? store.description : "");
    setCategory(store ? store.category.id : "");
    setImgS(store ? store.image : "");
    setName(store ? store.name : "");
    setWhatsApp(store ? store.whatsapp : "");
    setInstagram(store ? store.instagram : "");
    setSlug(store ? store.slug : "");
  }, [store]);

  return (
    <>
      {" "}
      <Card>
        <chakra.form
          onSubmit={(e) => {
            e.preventDefault();
            handleEdit()
          }}
        >
          <Grid
            gridTemplateColumns={isLargerThan1000 ? "1fr 2fr" : "1fr"}
            gap={4}
          >
            <Flex
              justifyContent="center"
              alignItems="center"
              mb="2"
              direction="column"
            >
              <Box position="relative" borderRadius="50%" cursor="pointer">
                <Image
                  borderRadius="full"
                  boxSize="150px"
                  alt="Dan Abramov"
                  src={img ? URL.createObjectURL(img as Blob) : imgS}
                  fallbackSrc="https://via.placeholder.com/500"
                  boxShadow="lg"
                />
              </Box>
              <Button
                onClick={() => setIsOpen(true)}
                mt="4"
                leftIcon={<EditIcon />}
              >
                Editar foto
              </Button>
            </Flex>
            <Box>
              <SimpleGrid columns={2} minChildWidth="200px" gap={4}>
                <FormControl id="storeName">
                  <FormLabel>Nome da loja</FormLabel>
                  <Input
                    name="storeName"
                    type="text"
                    autoComplete="storeName"
                    required
                    defaultValue={store?.name}
                    onChange={(event) => setName(event.target.value)}
                  />
                </FormControl>
                <FormControl id="category">
                  <FormLabel>Categoria</FormLabel>
                  <Select
                    name="category"
                    required
                    placeholder="Selecione a categoria"
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                  >
                    {categoriesList.map((cat, key) => (
                      <option key={key} value={cat.id}>
                        {cat.categoryName}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </SimpleGrid>
              <FormControl id="description" mt={4}>
                <FormLabel>Descrição</FormLabel>
                <Textarea
                  rows={4}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  maxLength={150}
                  resize="none"
                ></Textarea>
                <span
                  style={{
                    position: "absolute",
                    right: "10px",
                    bottom: "0",
                    opacity: "0.2",
                  }}
                >
                  {" "}
                  {150 - description.length}/150
                </span>
              </FormControl>
            </Box>
          </Grid>
          <SimpleGrid columns={3} minChildWidth="200px" gap={4} mt={4}>
            <FormControl id="slug">
              <FormLabel>Link da página</FormLabel>
              <InputGroup>
                <InputLeftAddon fontSize={"small"} children="www.peditz.com/" />
                <Input
                  placeholder="meu-restaurante"
                  type="text"
                  value={slug}
                  defaultValue={store?.slug}
                  onChange={(event) => setSlug(slugify(event.target.value))}
                />
              </InputGroup>
            </FormControl>

            <FormControl id="adress_zip_code">
              <FormLabel>WhatsApp</FormLabel>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<Icon as={FaWhatsapp} color="whatsapp.500" />}
                />
                <Input
                  type="tel"
                  placeholder="Phone number"
                  defaultValue={store?.whatsapp}
                  onChange={(event) => setWhatsApp(event.target.value)}
                />
              </InputGroup>
            </FormControl>
            <FormControl id="adress_district">
              <FormLabel>WhatsApp</FormLabel>

              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<Icon as={FaInstagram} color="facebook.500" />}
                />
                <Input
                  type="tel"
                  placeholder="Instagram"
                  defaultValue={store?.instagram}
                  onChange={(event) => setInstagram(event.target.value)}
                />
                <Box
                  pos="absolute"
                  top={"100%"}
                  zIndex={999999999}
                  width="100%"
                ></Box>
              </InputGroup>
            </FormControl>
          </SimpleGrid>
          <Flex mt={6}>
            <Button
              type="submit"
              ml="auto"
              colorScheme={"green"}
              paddingX={"8"}
            >
              <Icon mr="2" as={BiSave} /> Salvar
            </Button>
          </Flex>
        </chakra.form>
      </Card>
      <CropModal
        onCloseModal={() => setIsOpen(false)}
        onSave={(url) => setImg(url)}
        open={isOpen}
      />
    </>
  );
}
