import {
  Alert,
  AlertIcon,
  Button,
  chakra,
  FormControl,
  FormLabel,
  Image,
  Input,
  Link as ChakraLink,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Card } from "../../components/Card";
import { PasswordField } from "../../components/PasswordField";

import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
import { useState } from "react";
import api from "../../services/api";
import { setLogin } from "../../services/auth";

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorLoginMsg, setErrorLoginMsg] = useState("");

  return (
    <>
      <Card maxW="md" m="auto">
        <Image src={logo} mx="auto" w="60%" />
        <Text mt="4" mb="8" align="center" maxW="md" fontWeight="medium">
          <Text as="span">Seu negócio ainda não faz parte da Peditz?</Text>
          <br />
          <ChakraLink href="#" color="green.500">
            <Link to="/nova-conta">Teste grátis agora mesmo!</Link>
          </ChakraLink>
        </Text>
        {
          errorLoginMsg && <Alert mb="4" status='error'>
            <AlertIcon />
            {errorLoginMsg}
          </Alert>
        }

        <chakra.form
          onSubmit={(e) => {
            e.preventDefault();
            setIsLoading(true)
            api
              .post("api/auth/login", { email, password })
              .then((response) => {
                setLogin(response.data.access_token);
                setIsLoading(false)
              })
              .catch((err) => {
                setErrorLoginMsg(err.response?.data.message)
                setIsLoading(false)
              });

            // your login logic here
          }}
        >
          <Stack spacing="6">
            <FormControl id="email">
              <FormLabel>Email</FormLabel>
              <Input onChange={(event) => setEmail(event.target.value)} value={email} name="email" type="email" autoComplete="email" required />
            </FormControl>
            <PasswordField onChange={(event) => setPassword(event.target.value)} value={password} />
            <Button isLoading={isLoading} loadingText="Entrando..." type="submit" colorScheme="green" size="lg" fontSize="md">
              Entrar
            </Button>
          </Stack>
        </chakra.form>
      </Card>
    </>
  );
}
