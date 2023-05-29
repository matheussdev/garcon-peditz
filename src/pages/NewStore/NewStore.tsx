import {
  Button,
  chakra,
  FormControl,
  FormLabel,
  Image,
  Input,
  useMediaQuery,
  Grid,
  SimpleGrid,
  Flex,
  Box,
  Select,
  Textarea,
  InputGroup,
  InputLeftAddon,
  Heading,
  Divider,
  InputLeftElement,
  Icon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Text,
  FormErrorMessage,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tag,
  TagLabel,
  TagCloseButton,
  Alert,
  AlertIcon,
  useToast,
} from "@chakra-ui/react";
import { Card } from "../../components/Card";

import { EditIcon } from "@chakra-ui/icons";

import { FaInstagram, FaWhatsapp } from "react-icons/fa";

import { CropModal } from "../../components/CropModalBlob/CropModal";
import { FormEvent, useEffect, useState } from "react";
import { BiPlus, BiSave } from "react-icons/bi";
import slugify, { cepMask, telMask } from "../../utils/masks";
import { StateSelect } from "../../components/StateSelect";
import api from "../../services/api";
import { dayObject } from "../../components/Schedule/Schedule";
import { useNavigate } from "react-router-dom";

const week = [
  { pt: "Segunda-feira", en: "monday" },
  { pt: "Terça-feira", en: "tuesday" },
  { pt: "Quarta-feira", en: "wednesday" },
  { pt: "Quinta-feira", en: "thursday" },
  { pt: "Sexta-feira", en: "friday" },
  { pt: "Sábado", en: "saturday" },
  { pt: "Domingo", en: "sunday" },
];
interface addrees {
  road: string;
  complement: string;
  district: string;
  number: string;
  zipCode: string;
  latitude: string;
  longitude: string;
  state: string;
  city: string;
}

interface category {
  id: string;
  categoryName: string;
}

export function NewStore() {
  const [isLargerThan1000, isLargerThan600] = useMediaQuery([
    "(min-width: 1000px)",
    "(max-width: 600px)",
  ]);
  const [img, setImg] = useState<Blob>();
  const navigate = useNavigate();
  const toast = useToast();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpenSchedule, setIsOpenSchedule] = useState<boolean>(false);

  const [categoriesList, setCategoriesList] = useState<category[]>([]);

  const [dayScheduleSelect, setDayScheduleSelect] = useState<string>("");
  const [openClock, setOpenClock] = useState<string>("");
  const [closeClock, setCloseClock] = useState<string>("");
  const [count, setCount] = useState<number>(0);
  const [addScheduleError, setAddScheduleError] = useState<boolean>(false);

  const [whatsapp, setWhatsapp] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [slug, setSlug] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [instagram, setInstagram] = useState<string>("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState<addrees>({
    zipCode: "",
    road: "",
    complement: "",
    district: "",
    number: "",
    latitude: "",
    longitude: "",
    state: "",
    city: "",
  });

  const [result, setResult] = useState<dayObject>({
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
  });

  useEffect(() => {
    api
      .get("/api/categories/point-of-sale")
      .then((response) => {
        setCategoriesList(response.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const [cepError, setCepError] = useState<boolean>(false);

  async function getCEP(cep: string) {
    setAddress({ ...address, zipCode: cep });
    try {
      if (cep.length === 9) {
        let resp = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        let data = await resp.json();
        if (data.erro) {
          setCepError(true);
        } else {
          setCepError(false);
          setAddress({
            ...address,
            zipCode: data.cep,
            road: data.logradouro,
            district: data.bairro,
            state: data.uf,
            city: data.localidade,
          });
        }
      }
    } catch (err) {}
  }

  async function getInsta(v: string) {
    setInstagram(v);
    // if(v.length>=3){
    //   const resp = await fetch(`https://www.instagram.com/web/search/topsearch/?context=user&query=${v}`)
    //   const data = await resp.json();
    //   setListInsta(data)
    // }
  }

  useEffect(() => {}, [count]);

  function addSchedule(event: FormEvent) {
    event.preventDefault();
    let newResult: dayObject = result;

    if (newResult[dayScheduleSelect].length < 3) {
      newResult[dayScheduleSelect].push(`${openClock}-${closeClock}`);
      setTimeout(() => {
        setResult(newResult);
        setCount(count + 1);
        setIsOpenSchedule(false);
        setAddScheduleError(false);
      }, 100);
    } else {
      setAddScheduleError(true);
    }
  }
  function removeSchedule(key: number, day: string) {
    let newResult: dayObject = result;

    newResult[day].splice(key, 1);
    setResult(newResult);
    setCount(count + 1);
  }
  const data = new FormData();
  data.append(
    "pointOfSale",
    JSON.stringify({
      name,
      description,
      slug,
      category,
      whatsapp,
      instagram,
      address,
      typeOperation: "EATIN_DELIVERY",
      schedules: result,
    })
  );
  data.append("file", img as Blob);

  function sendForm(event: FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    api
      .post("/api/point-of-sale", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
          type: "formData",
        },
      })
      .then(() => {
        toast({
          title: "Ponto de venda adicionado!",
          description: "Veja na lista de pontos de vendas.",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
        navigate("/pontos-de-vendas");
      })
      .catch((err) => {
        toast({
          title: "Error!",
          description: err.response.data.message,
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <>
      <Grid gridTemplateColumns={isLargerThan1000 ? "1fr" : "1fr"} gap={0}>
        <Card>
          <chakra.form onSubmit={sendForm}>
            <Flex
              justifyContent="center"
              alignItems="center"
              mb="2"
              direction="column"
            >
              <Text mt="4" mb="8" align="center" fontWeight="medium">
                <Text as="span">
                  Adicione as informações do seu ponto de venda!
                </Text>
              </Text>
              <Box
                position="relative"
                backgroundColor="yellow"
                borderRadius="50%"
                cursor="pointer"
              >
                <Image
                  borderRadius="full"
                  boxSize="150px"
                  alt="Dan Abramov"
                  src={img ? URL.createObjectURL(img as Blob) : ""}
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
            <FormControl id="description" mb={4}>
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
            <SimpleGrid columns={2} minChildWidth="200px" gap={4}>
              <FormControl id="storeName">
                <FormLabel>Nome do ponto de venda</FormLabel>
                <Input
                  name="storeName"
                  type="text"
                  autoComplete="storeName"
                  required
                  value={name}
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
            <FormControl id="slug" mt={4}>
              <FormLabel>Crie um link para o seu estabelecimento</FormLabel>
              <InputGroup>
                <InputLeftAddon children="www.peditz.com/" />
                <Input
                  placeholder="meu-restaurante"
                  type="text"
                  value={slug}
                  onChange={(event) => setSlug(slugify(event.target.value))}
                />
              </InputGroup>
            </FormControl>
            <Divider mt={8} mb={4} />
            {/* <Heading as="h6" size={"md"} mb={4}>
            Contato
          </Heading> */}
            <SimpleGrid mb={4} columns={2} minChildWidth="200px" gap={4}>
              <FormControl id="whatsapp">
                <FormLabel>WhatsApp</FormLabel>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<Icon as={FaWhatsapp} color="whatsapp.500" />}
                  />
                  <Input
                    maxLength={15}
                    type="tel"
                    placeholder="(DDD) 99999-9999"
                    value={whatsapp}
                    onChange={(event) =>
                      setWhatsapp(telMask(event.target.value))
                    }
                  />
                </InputGroup>
              </FormControl>
              <FormControl id="instagram">
                <FormLabel>Instagram</FormLabel>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<Icon as={FaInstagram} color="facebook.500" />}
                  />
                  <Input
                    type="tel"
                    placeholder="Instagram"
                    value={instagram}
                    onChange={(event) => getInsta(event.target.value)}
                  />
                  <Box
                    pos="absolute"
                    top={"100%"}
                    zIndex={999999999}
                    width="100%"
                  >
                    {/* <Menu isOpen={instagram.length >= 3}>
                      <MenuList>
                        {listInsta?.map((user)=>{
                          <MenuItem minH='48px'>
                          <Image
                            boxSize='2rem'
                            borderRadius='full'
                            src='https://placekitten.com/100/100'
                            alt='Fluffybuns the destroyer'
                            mr='12px'
                          />
                          <span>Fluffybuns the Destroyer</span>
                        </MenuItem>
                        })}
                        
                      </MenuList>
                    </Menu> */}
                  </Box>
                </InputGroup>
              </FormControl>
            </SimpleGrid>
            <Heading as="h6" size={"md"} mb={2}>
              Endereço
            </Heading>
            <SimpleGrid mb={4} columns={2} minChildWidth="200px" gap={4}>
              <FormControl isInvalid={cepError} id="cep">
                <FormLabel>Cep</FormLabel>
                <Input
                  maxLength={9}
                  name="cep"
                  type="text"
                  autoComplete="cep"
                  required
                  value={address.zipCode}
                  onChange={(event) => getCEP(cepMask(event.target.value))}
                  onBlur={() => getCEP(address.zipCode)}
                />
                <FormErrorMessage>Cep inválido !</FormErrorMessage>
              </FormControl>
              <FormControl id="adress_district">
                <FormLabel>Bairro</FormLabel>
                <Input
                  name="adress_district"
                  type="text"
                  autoComplete="adress_district"
                  value={address.district}
                  onChange={(event) =>
                    setAddress({ ...address, district: event.target.value })
                  }
                  required
                />
              </FormControl>
            </SimpleGrid>
            <Grid gridTemplateColumns={"3fr 1fr"} gap={4}>
              <FormControl id="adress_street">
                <FormLabel>Rua</FormLabel>
                <Input
                  name="adress_street"
                  type="text"
                  autoComplete="adress_street"
                  value={address.road}
                  onChange={(event) =>
                    setAddress({ ...address, road: event.target.value })
                  }
                  required
                />
              </FormControl>
              <FormControl id="adress_number">
                <FormLabel>Número</FormLabel>
                <Input
                  name="adress_number"
                  type="text"
                  autoComplete="adress_number"
                  value={address.number}
                  onChange={(event) =>
                    setAddress({ ...address, number: event.target.value })
                  }
                  required
                />
              </FormControl>
            </Grid>

            <FormControl mt={4} id="adress_complement">
              <FormLabel>Complemento</FormLabel>
              <Input
                name="adress_complement"
                type="text"
                autoComplete="adress_complement"
                onChange={(event) =>
                  setAddress({ ...address, complement: event.target.value })
                }
              />
            </FormControl>
            <SimpleGrid mt={4} columns={2} minChildWidth="200px" gap={4}>
              <FormControl id="adress_city">
                <FormLabel>Cidade</FormLabel>
                <Input
                  name="adress_city"
                  type="text"
                  autoComplete="adress_city"
                  required
                  value={address.city}
                  onChange={(event) =>
                    setAddress({ ...address, city: event.target.value })
                  }
                />
              </FormControl>
              <FormControl id="adress_district">
                <FormLabel>Estado</FormLabel>
                <StateSelect
                  value={address.state}
                  onChange={(event) =>
                    setAddress({ ...address, state: event.target.value })
                  }
                  isRequired
                />
              </FormControl>
            </SimpleGrid>
            <Divider mt={8} mb={4} />
            <Heading
              as="h6"
              size={"md"}
              mb={4}
              display={"flex"}
              justifyContent={isLargerThan600 ? "start" : "space-between"}
              flexDirection={isLargerThan600 ? "column" : "row"}
            >
              Horário de funcionamento
              <Popover>
                <PopoverTrigger>
                  <Button
                    size={"sm"}
                    leftIcon={<Icon as={BiPlus} w={4} h={4} />}
                    colorScheme="blue"
                    variant="solid"
                    onClick={() => setIsOpenSchedule(true)}
                  >
                    Adicionar horário
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverHeader>Confirmation!</PopoverHeader>
                  <PopoverBody>
                    Are you sure you want to have that milkshake?
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </Heading>
            <SimpleGrid
              columns={2}
              minChildWidth={isLargerThan600 ? 100 : 400}
              gap={4}
            >
              <>
                {week.map((day, key) => (
                  <Box key={key}>
                    {day.pt}:
                    <Flex>
                      <SimpleGrid
                        columns={2}
                        flex={1}
                        minChildWidth={85}
                        gap={2}
                      >
                        {result[day.en].length === 0 && (
                          <Tag
                            size={"smal"}
                            borderRadius="full"
                            variant="solid"
                            colorScheme="red"
                            px={2}
                            width={"fit-content"}
                          >
                            Fechado
                          </Tag>
                        )}
                        {result ? (
                          <>
                            {result[day.en]?.map((s, key) => (
                              <Tag
                                key={`${s}-${key}-${day.en}`}
                                size={"smal"}
                                borderRadius="full"
                                variant="solid"
                                colorScheme="green"
                                px={1}
                                width={"fit-content"}
                              >
                                <TagLabel>{s}</TagLabel>
                                <TagCloseButton
                                  onClick={() => {
                                    removeSchedule(key, day.en);
                                  }}
                                />
                              </Tag>
                            ))}
                          </>
                        ) : (
                          ""
                        )}
                      </SimpleGrid>
                    </Flex>
                  </Box>
                ))}
              </>
            </SimpleGrid>
            <Flex justifyContent={"flex-end"} mt={6}>
              <Button
                type="submit"
                colorScheme={"green"}
                isLoading={isLoading}
                leftIcon={<Icon as={BiSave} h={5} w={"100%"} />}
              >
                Salvar
              </Button>
            </Flex>
          </chakra.form>
        </Card>
      </Grid>

      <Modal isOpen={isOpenSchedule} onClose={() => setIsOpenSchedule(false)}>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={addSchedule}>
            <ModalHeader>Adicionar horário</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              {addScheduleError && (
                <Alert status="error" mb="4">
                  <AlertIcon />
                  Você só pode adicionar 3 horários de funcionamento em um dia!
                </Alert>
              )}

              <FormControl>
                <FormLabel>Dia da semana:</FormLabel>
                <Select
                  required
                  onChange={(event) =>
                    setDayScheduleSelect(event?.target.value)
                  }
                >
                  <option value="">Selecione</option>
                  <option value="monday">Segunda-feira</option>
                  <option value="tuesday">terça-feira</option>
                  <option value="wednesday">Quarta-feira</option>
                  <option value="thursday">Quinta-feira</option>
                  <option value="friday">Sexta-feira</option>
                  <option value="saturday">Sábado</option>
                  <option value="sunday">Domingo</option>
                </Select>
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Horário de abertura:</FormLabel>
                <Input
                  onChange={(event) => setOpenClock(event?.target.value)}
                  required
                  type={"time"}
                  placeholder="00:00"
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Horário de fechamento:</FormLabel>
                <Input
                  onChange={(event) => setCloseClock(event?.target.value)}
                  required
                  type={"time"}
                  placeholder="00:00"
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button onClick={() => setIsOpenSchedule(false)} mr={"auto"}>
                Cancelar
              </Button>
              <Button colorScheme="blue" type="submit">
                Adicionar
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      <CropModal
        onCloseModal={() => setIsOpen(false)}
        onSave={(url) => setImg(url)}
        open={isOpen}
      />
    </>
  );
}
