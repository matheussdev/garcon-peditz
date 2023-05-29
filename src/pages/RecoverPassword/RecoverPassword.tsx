import {
    Button,
    chakra,
    FormControl,
    FormLabel,
    Icon,
    Image,
    Input,
    Link as ChakraLink,
    Stack,
    Text,
} from "@chakra-ui/react";
import { Card } from "../../components/Card";

import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
import { useState } from "react";
import { ArrowBackIcon } from "@chakra-ui/icons";

export function RecoverPassword() {
    const [email, setEmail] = useState('');
    return (
        <>
            <Card maxW="md" m="auto">
                <Image src={logo} mx="auto" w="60%" />
                <Text mt="4" mb="8" align="center" maxW="md" fontWeight="medium">
                    <Text as="span">Digite seu email para recuperar sua senha.</Text>
                </Text>
                <chakra.form
                    onSubmit={(e) => {
                        e.preventDefault();
                        // login(email, password);
                        // your login logic here
                    }}
                >
                    <Stack spacing="6">
                        <FormControl id="email">
                            <FormLabel>Email</FormLabel>
                            <Input onChange={(event) => setEmail(event.target.value)} value={email} name="email" type="email" autoComplete="email" required />
                        </FormControl>
                        <Button type="submit" colorScheme="green" size="lg" fontSize="md">
                            Recuperar senha
                        </Button>
                        
                        <ChakraLink href="#" my={"4"} color="green.500" textAlign={"center"}>
                            <Link to="/login"><Icon as={ArrowBackIcon}/> Voltar para o login</Link>
                        </ChakraLink>
                    </Stack>
                </chakra.form>
            </Card>
        </>
    );
}
