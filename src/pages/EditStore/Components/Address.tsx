import React from "react";
import { Heading, SimpleGrid, FormControl, FormLabel, Input, Grid, Flex, Button, useToast, chakra, FormErrorMessage,Icon } from "@chakra-ui/react";
import { FormEvent, useEffect, useState } from "react";
import { Card } from "../../../components/Card";
import { StateSelect } from "../../../components/StateSelect";
import api from "../../../services/api";
import { cepMask } from "../../../utils/masks";
import { BiSave } from "react-icons/bi";

interface AdressProps {
    address?: {
        complement: string;
        district: string;
        id: string;
        latitude: string;
        longitude: string;
        number: string;
        road: string;
        zipCode: string;
        city: {
            name: string;
        };
        state: {
            initials: string;
        }

    }
    pId?: string,
}

export function Address({ address, pId }: AdressProps) {
    const toast = useToast()

    const [zipCode, setZip_code] = useState<string | undefined>("")
    const [district, setDistrict] = useState<string | undefined>("")
    const [road, setRoad] = useState<string | undefined>("")
    const [complement, setComplement] = useState<string | undefined>("")
    const [number, setNumber] = useState<string | undefined>("")
    const [city, setCity] = useState<string | undefined>("")
    const [state, setState] = useState<string | undefined>("")

    const [cepError, setCepError] = useState<boolean>(false);


    useEffect(() => {
        setZip_code(address?.zipCode)
        setDistrict(address?.district)
        setRoad(address?.road)
        setComplement(address?.complement)
        setNumber(address?.number)
        setCity(address?.city.name)
        setState(address?.state.initials)
    }, [address])


    async function getCEP(cep: string | undefined) {
        try {
            if (cep?.length === 9) {
                let resp = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
                let data = await resp.json();
                if (data.erro) {
                    setCepError(true)
                }
                else {
                    setCepError(false)
                    setZip_code(data.cep)
                    setDistrict(data.bairro)
                    setRoad(data.logradouro)
                    setCity(data.localidade)
                    setState(data.uf)
                }
            }
        } catch (err) {

        }

    }


    function sendAddress(e: FormEvent) {
        e.preventDefault()
        api.patch("/api/point-of-sale/address", {
            road,
            complement,
            district,
            number,
            zipCode,
            latitude: "",
            longitude: "",
            city,
            pointOfSaleId: pId,
            state
        }).then(() => {
            toast({
                title: 'Endereço editado com sucesso!',
                status: 'success',
                duration: 4000,
                isClosable: true,
            })
        }).catch((err) => {
            toast({
                title: 'Error!',
                description: "Houve um error ao tentar editar sua pagina!",
                status: 'error',
                duration: 4000,
                isClosable: true,
            })
            console.log(err)
        }).finally(() => { })
    }

    return <Card>
        <Heading as="h6" size={"md"} mb={2}>
            Endereço
        </Heading>
        <chakra.form onSubmit={sendAddress}>
            <SimpleGrid mb={4} columns={2} minChildWidth="200px" gap={4}>
                <FormControl isInvalid={cepError} id="adress_zip_code">
                    <FormLabel>Cep</FormLabel>
                    <Input
                        maxLength={9}
                        name="adress_zip_code"
                        type="tel"
                        autoComplete="adress_zip_code"
                        value={zipCode}
                        onChange={(event) => setZip_code(cepMask(event.target.value))}
                        required
                        onBlur={()=>getCEP(zipCode)}
                    />
                    <FormErrorMessage>Cep inválido !</FormErrorMessage>
                </FormControl>
                <FormControl id="adress_district">
                    <FormLabel>Bairro</FormLabel>
                    <Input
                        name="adress_district"
                        type="text"
                        autoComplete="adress_district"
                        value={district}
                        onChange={(event) => setDistrict(event.target.value)}
                        required
                    />
                </FormControl>
            </SimpleGrid>
            <Grid gridTemplateColumns={"2fr 2fr 1fr"} gap={4}>
                <FormControl id="adress_street">
                    <FormLabel>Rua</FormLabel>
                    <Input
                        name="adress_street"
                        type="text"
                        autoComplete="adress_street"
                        required
                        value={road}
                        onChange={(event) => setRoad(event.target.value)}
                    />
                </FormControl>
                <FormControl id="adress_complement">
                    <FormLabel>Complemento</FormLabel>
                    <Input
                        name="adress_complement"
                        type="text"
                        autoComplete="adress_complement"
                        value={complement}
                        onChange={(event) => setComplement(event.target.value)}
                    />
                </FormControl>
                <FormControl id="adress_number">
                    <FormLabel>Número</FormLabel>
                    <Input
                        name="adress_number"
                        type="text"
                        autoComplete="adress_number"
                        required
                        onChange={(event) => setNumber(event.target.value)}
                        value={number}
                    />
                </FormControl>
            </Grid>
            <SimpleGrid mt={4} columns={2} minChildWidth="200px" gap={4}>
                <FormControl id="adress_city">
                    <FormLabel>Cidade</FormLabel>
                    <Input
                        name="adress_city"
                        type="text"
                        autoComplete="adress_city"
                        required
                        value={city}
                        onChange={(event) => setCity(event.target.value)}
                    />
                </FormControl>
                <FormControl id="adress_district">
                    <FormLabel>Estado</FormLabel>
                    <StateSelect
                        value={state}
                        onChange={(event) => setState(event.target.value)}
                        isRequired
                    />
                </FormControl>
            </SimpleGrid>
            <Flex mt={6}>
                <Button type="submit" ml="auto" colorScheme={"green"} paddingX={"8"}><Icon mr="2" as={BiSave} /> Salvar</Button>
            </Flex>
        </chakra.form>
    </Card>
}