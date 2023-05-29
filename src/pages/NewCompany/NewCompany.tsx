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
  Textarea,
  InputGroup,
  InputLeftAddon,
  Icon,
  Text,
} from "@chakra-ui/react";
import { Card } from "../../components/Card";

import { EditIcon } from "@chakra-ui/icons";
import logo from "../../assets/logo.png";

import { CropModal } from "../../components/CropModalBlob/CropModal";
import { FormEvent, useState } from "react";
import {  BiSave } from "react-icons/bi";
import slugify from "../../utils/masks";
import api from "../../services/api";
export function NewCompany() {
  const [isLargerThan1000] = useMediaQuery([
    "(min-width: 1000px)",
    "(max-width: 600px)",
  ]);
  const [image, setImage] = useState<Blob>();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [name, setName] = useState<string>("");
  const [slug, setSlug] = useState<string>("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const data = new FormData();
  data.append("name", name);
  data.append("slug", slug);
  data.append("description", description);
  data.append("file", image as Blob);

  function sendForm(event: FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    api
      .post("/api/company", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
          type: "formData",
        },
      })
      .then((response) => {
        window.location.href = "/";
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }

  return (
    <>
      <Grid
        gridTemplateColumns={isLargerThan1000 ? "1fr" : "1fr"}
        gap={4}
        mx={"auto"}
      >
        <Card>
          <chakra.form onSubmit={sendForm}>
            <Flex
              justifyContent="center"
              alignItems="center"
              mb="2"
              direction="column"
            >
              <Image src={logo} mx="auto" w="60%" />
              <Text mt="4" mb="8" align="center" fontWeight="medium">
                <Text as="span">Adicione as informações da sua empresa!</Text>
              </Text>
              <Box
                position="relative"
                backgroundColor="yellow"
                borderRadius="50%"
                cursor="pointer"
              >
                {image && (
                  <Image
                    borderRadius="full"
                    boxSize="150px"
                    alt="Dan Abramov"
                    src={URL.createObjectURL(image as Blob)}
                    fallbackSrc="https://via.placeholder.com/500"
                    boxShadow="lg"
                  />
                )}
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
                <FormLabel>Nome da loja</FormLabel>
                <Input
                  name="storeName"
                  type="text"
                  autoComplete="storeName"
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
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

      <CropModal
        onCloseModal={() => setIsOpen(false)}
        onSave={(url) => setImage(url)}
        open={isOpen}
      />
    </>
  );
}
