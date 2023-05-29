import {
  Button,
  chakra,
  Checkbox,
  FormControl,
  FormLabel,
  Image,
  Input,
  Stack,
  Text,
  Link as ChakraLink,
  SimpleGrid,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { Card } from "../../components/Card";
import { PasswordField } from "../../components/PasswordField";
import { ArrowBackIcon } from "@chakra-ui/icons";
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'



import "./style.css";


import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
import { useState } from "react";
import api from "../../services/api";
import { createAccount } from "../../services/auth";

export function Register() {
  const [phone, setPhone] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const [errorRegisterMsg, setErrorRegisterMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <Card maxW="4xl" m="auto">
        <Image src={logo} mx="auto" w="60%" />
        <Text mt="4" mb="8" align="center" fontWeight="medium">
          <Text as="span">
            Crie sua conta e escale as vendas do seu negócio!
          </Text>
        </Text>
        <chakra.form
          onSubmit={(e) => {
            e.preventDefault();

            setIsLoading(true)
            api
              .post("/api/users", { email, password, name, telephone: phone })
              .then((response) => {
                createAccount(response.data.acess_token);
                setIsLoading(false)
              })
              .catch((err) => {
                setErrorRegisterMsg(err.response.data.message);
                setIsLoading(false)
              });
            // your login logic here
          }}
        >
          {
            errorRegisterMsg && <Alert mb="4" status="error">
              <AlertIcon />
              {errorRegisterMsg}</Alert>
          }

          <SimpleGrid columns={2} minChildWidth="250px" gap={4}>
            <FormControl id="email">
              <FormLabel>Email</FormLabel>
              <Input onChange={(event) => setEmail(event.target.value)} value={email} name="email" type="email" autoComplete="email" required />
            </FormControl>
            <FormControl id="nome">
              <FormLabel>Nome completo</FormLabel>
              <Input onChange={(event) => setName(event.target.value)} value={name} name="nome" type="text" autoComplete="name" required />
            </FormControl>
            <FormControl id="phone">
              <FormLabel>Telefone</FormLabel>
              {/* <Input name="phone" value={phone} type="tel" autoComplete="phone" required /> */}
              {/* <PhoneInput
                className="phoneInput"
                defaultCountry="BR"
                placeholder="ex: +55 99 99999-9999"
                value={phone}
                maxLength={17}
                onChange={(value) => setPhone(value as string)} /> */}
            </FormControl>
            <PasswordField onChange={(event) => setPassword(event.target.value)} value={password} register />
          </SimpleGrid>
          <Stack spacing={6} mt={6}>
            <Checkbox colorScheme="green" isRequired>
              Li e aceito os temos de uso.
            </Checkbox>
            <Button isLoading={isLoading} loadingText="Criando uma nova conta..." type="submit" colorScheme="green" size="lg" fontSize="md">
              Cadastre-se
            </Button>

            <ChakraLink
              mt="4"
              mb="8"
              textAlign="center"
              fontWeight="medium"
              color="green.500"
              as={Link}
              to={"/login"}
            >

              <ArrowBackIcon /> Já tem uma conta? volte para o login.
            </ChakraLink>
          </Stack>
        </chakra.form>
      </Card>
    </>
  );
}
