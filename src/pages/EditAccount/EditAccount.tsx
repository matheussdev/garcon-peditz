import { EditIcon } from "@chakra-ui/icons"
import {
  Alert,
  AlertIcon, Box, Button,
  chakra, Flex, FormControl,
  FormLabel, Grid, Icon, Image, Input, InputGroup,
  InputLeftAddon, SimpleGrid, Stack,
  Text, Textarea, useMediaQuery, useToast
} from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { BiSave } from "react-icons/bi"
import PhoneInput from "react-phone-number-input"
import { Card } from "../../components/Card"
import { PasswordField } from "../../components/PasswordField"
import { useLogin } from "../../hooks/useLogin"

import { CropModal } from "../../components/CropModalBlob/CropModal"
import api from "../../services/api"
import slugify from "../../utils/masks"

export function EditAccount() {
  const toast = useToast();

  const [isLargerThan1000] = useMediaQuery(["(min-width: 1000px)"]);
  const { user } = useLogin();
  const [name, setName] = useState("");
  const [telephone, setTelephone] = useState("");
  const [isLoadingAccount, setIsLoadingAccount] = useState(false);
  const [isLoadingPass, setIsLoadingPass] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [nameCompany, setNameCompany] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [slug, setSlug] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [description, setDescription] = useState("");
  const [updatePassError, setUpdatePassError] = useState("");

  useEffect(() => {
    setTelephone(user.telephone);
    setName(user.name);
    api.get('/api/company').then((response)=>{
      setNameCompany(response.data.name)
      setDescription(response.data.description)
      setSlug(response.data.slug)
      setImage(response.data.image.link)
    })
  }, [user]);

  return (
    <Grid gridTemplateColumns={isLargerThan1000 ? "1fr 1fr" : "1fr"} gap={4}>
      <Grid gridTemplateColumns={"1fr"} gap={6}>
        <Card>
          <chakra.form
            onSubmit={(e) => {
              e.preventDefault();
              setIsLoadingAccount(true);
              api
                .patch("api/users/", { name, telephone })
                .then((response) => {
                  toast({
                    title: "Conta editada com sucesso!",
                    status: "success",
                    duration: 4000,
                    isClosable: true,
                  });
                })
                .catch((err) => {
                  toast({
                    title: "Error!",
                    description: "Houve um error ao tentar editar sua conta!",
                    status: "error",
                    duration: 4000,
                    isClosable: true,
                  });
                })
                .finally(() => {
                  setIsLoadingAccount(false);
                });
            }}
          >
            <FormControl id="email" mb={4}>
              <FormLabel>Email</FormLabel>
              <Input
                name="email"
                type="email"
                value={user.email}
                readOnly
                disabled
                autoComplete="email"
                required
              />
            </FormControl>
            <SimpleGrid columns={2} minChildWidth="150px" gap={4}>
              <FormControl id="nome">
                <FormLabel>Nome completo</FormLabel>
                <Input
                  name="nome"
                  type="text"
                  defaultValue={user.name}
                  autoComplete="name"
                  required
                  onChange={(event) => setName(event.target.value)}
                />
              </FormControl>
              <FormControl id="phone">
                <FormLabel>Telefone</FormLabel>
                {/* <PhoneInput
                  required
                  className="phoneInput"
                  defaultCountry="BR"
                  placeholder="ex: +55 99 99999-9999"
                  maxLength={17}
                  value={telephone}
                  onChange={(value) => setTelephone(value as string)}
                /> */}
              </FormControl>
            </SimpleGrid>
            <Stack spacing={6} mt={6}>
              <Button
                isLoading={isLoadingAccount}
                loadingText="Editando..."
                type="submit"
                colorScheme="green"
                fontSize="md"
              >
                Salvar
              </Button>
            </Stack>
          </chakra.form>
        </Card>
        <Card>
          <chakra.form
            onSubmit={(e) => {
              e.preventDefault();
              setIsLoadingPass(true);
              setUpdatePassError("");
              api
                .patch("api/users/password", { currentPassword, newPassword })
                .then((response) => {
                  toast({
                    title: "Senha alterada com sucesso!",
                    status: "success",
                    duration: 4000,
                    isClosable: true,
                  });
                  setCurrentPassword("");
                  setNewPassword("");
                })
                .catch((err) => {
                  toast({
                    title: "Error!",
                    description: "Houve um error ao tentar editar sua senha!",
                    status: "error",
                    duration: 4000,
                    isClosable: true,
                  });
                  setUpdatePassError(err.response.data.error);
                })
                .finally(() => {
                  setIsLoadingPass(false);
                });
            }}
          >
            {updatePassError && (
              <Alert mb={4} status="error">
                <AlertIcon />
                <Text>{updatePassError}</Text>
              </Alert>
            )}
            <SimpleGrid columns={2} minChildWidth="150px" gap={4}>
              <PasswordField
                value={currentPassword}
                label={"Senha atual"}
                register
                onChange={(event) => setCurrentPassword(event.target.value)}
              />
              <PasswordField
                value={newPassword}
                register
                label={"Nova senha"}
                id="senhanova"
                onChange={(event) => setNewPassword(event.target.value)}
              />
            </SimpleGrid>
            <Stack spacing={6} mt={6}>
              <Button
                isLoading={isLoadingPass}
                loadingText="Aterando senha..."
                type="submit"
                colorScheme="green"
                fontSize="md"
              >
                Alterar Senha
              </Button>
            </Stack>
          </chakra.form>
        </Card>
      </Grid>
      <Card>
        <chakra.form onSubmit={()=>{}}>
          <Flex
            justifyContent="center"
            alignItems="center"
            mb="2"
            direction="column"
          >
            <Text mt="4" mb="8" align="center" fontWeight="medium">
              <Text as="span">Edite as informações da sua empresa!</Text>
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
                  src={image}
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
              <FormLabel>Nome da companhia</FormLabel>
              <Input
                name="storeName"
                type="text"
                autoComplete="storeName"
                required
                value={nameCompany}
                onChange={(event) => setNameCompany(event.target.value)}
              />
            </FormControl>
          </SimpleGrid>
          <FormControl id="slug" mt={4}>
            <FormLabel>Crie um link para o sua companhia.</FormLabel>
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
              leftIcon={<Icon as={BiSave} h={5} w={"100%"} />}
            >
              Salvar
            </Button>
          </Flex>
        </chakra.form>
      </Card>
      <CropModal
        onCloseModal={() => setIsOpen(false)}
        onSave={(url) => {}}
        open={isOpen}
      />
    </Grid>

  );
}
