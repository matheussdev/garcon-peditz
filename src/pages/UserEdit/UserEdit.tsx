import {
  Button,
  chakra, Divider, Flex, FormControl,
  FormLabel, Grid, Icon, Input, InputGroup, Select, SimpleGrid, Switch, useToast
} from "@chakra-ui/react";
import { Card } from "../../components/Card";


import { FormEvent, useCallback, useEffect, useState } from "react";
import { BiSave } from "react-icons/bi";
import { useNavigate, useParams } from "react-router-dom";
import { PasswordField } from "../../components/PasswordField";
import { TagsSelect } from "../../components/Tags";
import api from "../../services/api";
import { User } from "../../types";
import { telMask } from "../../utils/masks";

interface PointOfSale {
  id: number;
  name: string;
}

interface SelectedTags {
  id: number;
  label: string;
}

export const UserEdit: React.FC = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const toast = useToast();

  const [pointOfSaleName, setPointOfSaleName] = useState<PointOfSale[]>([]);
  const [load, setLoad] = useState(false);
  const [user, setUser] = useState<User>();

  const tagOptions: SelectedTags[] = [
    { id: 1, label: "Dashboard" },
    { id: 2, label: "Caixa" },
    { id: 3, label: "Produtos" },
    { id: 4, label: "Comandas" },
    { id: 5, label: "Estoque" },
    { id: 6, label: "Usuários" },
    { id: 7, label: "Ponto de vendas" },
  ];

  const getUser = useCallback(() => {
    api.get(`/api/collaborators/${userId}`).then((response) => {
      const obj = response.data;
      setUser({
        ...obj,
      });

      console.log(response.data);
    });
  }, [userId]);

  const updateUser = (event: FormEvent) => {
    event.preventDefault();
    setLoad(true);

    api.patch(`/api/collaborators/${userId}`, {
      name: user?.name,
      email: user?.email,
      telephone: user?.telephone,
      password: user?.password,
      pointOfSaleId: user?.pointOfSaleId,
      superUser: user?.superUser,
    })
      .then(response => {
        const obj = response.data;
        setUser({
          ...obj,
        })
        toast({
          title: "Informações editadas!",
          description: "",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
        console.log(response.data);
        navigate('/users');
      })
      .catch(error => {
        toast({
          title: "Ocorreu um erro ao editar usuário!",
          description: "",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      })
      .finally(() => {
        setLoad(false);
      });
  };

  useEffect(() => {
    getUser();

      api.get("/api/point-of-sale")
        .then((response) => {
          setPointOfSaleName(response.data);
      })
      .catch((error) => console.error(error));
  }, [getUser]);

  return (
    <>
      <Grid>
        <Card>
          <chakra.form onSubmit={updateUser}>
            <SimpleGrid columns={2} minChildWidth="200px" gap={4} mt={4}>
              <FormControl id="name">
                <FormLabel>Nome completo</FormLabel>
                <Input
                  name="name"
                  type="text" 
                  required
                  value={user?.name}
                  placeholder="Nome do funcionário"
                  onChange={(event) => setUser({
                    ...user,
                    name: event.target.value
                  } as User)}
                />
              </FormControl>
              <FormControl id="email">
                <FormLabel>E-mail</FormLabel>
                <Input
                  name="emai"
                  type="email"
                  required
                  value={user?.email}
                  placeholder="E-mail do funcionário"
                  onChange={(event) => setUser({
                    ...user,
                    email: event.target.value
                  } as User)}
                />
              </FormControl>
            </SimpleGrid>
            
            <Divider mt={8} mb={4} />
            
            <SimpleGrid mb={4} columns={2} minChildWidth="200px" gap={4}>
            <FormControl id="telephone">
                <FormLabel>Telefone</FormLabel>
                <InputGroup>
                  <Input
                    maxLength={15}
                    type="tel"
                    required
                    placeholder="(DDD) 99999-9999"
                    value={user?.telephone}
                    onChange={(event) =>  setUser({
                      ...user,
                      telephone: telMask(event.target.value)
                    } as User)}
                  />
                </InputGroup>
              </FormControl>
              <FormControl id="tags">
                <FormLabel>Módulos que o funcionário pode ter acesso</FormLabel>
                <TagsSelect tagOptions={tagOptions}/>
              </FormControl>
            </SimpleGrid>
            
            <Divider mt={8} mb={4} />

            <SimpleGrid columns={3} minChildWidth="150px" gap={4}>
              <FormControl id="password">
              <PasswordField
                value={user?.password}
                label={"Senha de acesso"}
                register
                placeholder="Senha de acesso do funcionário"
                onChange={(event) => setUser({
                  ...user,
                  password: event.target.value
                } as User)}
              />
              </FormControl>
              <FormControl id="company">
                <FormLabel>Pontos de venda</FormLabel>
                <Select
                  name="pointOfSale"
                  required
                  placeholder="Selecione o ponto de venda"
                  value={user?.pointOfSaleId}
                  onChange={(event) => setUser({
                    ...user,
                    pointOfSaleId: event.target.value
                  } as User)}
                >
                  {pointOfSaleName.map(pointOfSale =>
                    <option key={pointOfSale.id} value={pointOfSale.id}>{pointOfSale.name}</option>
                  )}
                </Select>
              </FormControl>
              <FormControl id="superUser">
                <FormLabel>É administrador?</FormLabel>
                <Switch
                  size="lg"
                  isChecked={user?.superUser}
                  onChange={event => setUser({
                    ...user,
                    superUser: event.target.checked
                  } as User)}
                />
              </FormControl>
            </SimpleGrid>
           
            <Flex justifyContent={"flex-end"} mt={6}>
              <Button
                isLoading={load}
                type="submit"
                colorScheme={"green"}
                leftIcon={<Icon as={BiSave} h={5} w={"100%"} />}
              >
                Salvar
              </Button>
            </Flex>
          </chakra.form>
        </Card>
      </Grid>
    </>
  );
}
