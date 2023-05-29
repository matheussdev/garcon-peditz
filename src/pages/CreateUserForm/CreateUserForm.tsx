import {
  Button,
  chakra, Divider, Flex, FormControl,
  FormLabel, Grid, Icon, Input, InputGroup, Select, SimpleGrid, Switch, useToast
} from "@chakra-ui/react";
import { Card } from "../../components/Card";


import { FormEvent, useEffect, useState } from "react";
import { BiSave } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { PasswordField } from "../../components/PasswordField";
import { TagsSelect } from "../../components/Tags";
import api from "../../services/api";

interface PointOfSale {
  id: number;
  name: string;
}

interface SelectedTags {
  id: number;
  label: string;
}

interface Users {
  name: string,
  email: string,
  telephone: string,
  password:string,
  pointOfSaleId: string,
  superUser: boolean
}

export function CreateUserForm() {
  const navigate = useNavigate();
  const toast = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [superUser, setSuperUser] = useState(false);
  const [password, setPassword] = useState('');
  const [pointOfSaleName, setPointOfSaleName] = useState<PointOfSale[]>([]);
  const [pointOfSaleId, setPointOfSaleId] = useState<string>("");

  const tagOptions: SelectedTags[] = [
    { id: 1, label: "Dashboard" },
    { id: 2, label: "Caixa" },
    { id: 3, label: "Produtos" },
    { id: 4, label: "Comandas" },
    { id: 5, label: "Estoque" },
    { id: 6, label: "Usuários" },
    { id: 7, label: "Ponto de vendas" },
  ];

  const createNewUser = (event: FormEvent) => {
    event.preventDefault();

    const newUser: Users = {
      name,
      email,
      telephone,
      password,
      pointOfSaleId,
      superUser,
    };

    api.post('/api/collaborators', newUser)
      .then(response => {
        navigate('/users');
      })
      .catch(error => {
        if(error.response.status === 400) {
          toast({
            title: "E-mail ou telefone já está em uso de acordo com nossos registros",
            description: "",
            status: "info",
            duration: 4000,
            isClosable: true,
          });
        }
      });
  };

  useEffect(() => {
      api.get("/api/point-of-sale")
        .then((response) => {
          setPointOfSaleName(response.data);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <>
      <Grid>
        <Card>
          <chakra.form onSubmit={createNewUser}>
            <SimpleGrid columns={2} minChildWidth="200px" gap={4} mt={4}>
              <FormControl id="name">
                <FormLabel>Nome completo</FormLabel>
                <Input
                  name="name"
                  type="text" 
                  required
                  value={name}
                  placeholder="Nome do funcionário"
                  onChange={(event) => setName(event.target.value)}
                />
              </FormControl>
              <FormControl id="email">
                <FormLabel>E-mail</FormLabel>
                <Input
                  name="emai"
                  type="email"
                  required
                  value={email}
                  placeholder="E-mail do funcionário"
                  onChange={(event) => setEmail(event.target.value)}
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
                    value={telephone}
                    onChange={(event) =>
                      setTelephone(event.target.value)
                    }
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
                value={password}
                label={"Senha de acesso"}
                register
                placeholder="Senha de acesso do funcionário"
                onChange={(event) => setPassword(event.target.value)}
              />
              </FormControl>
              <FormControl id="company">
                <FormLabel>Pontos de venda</FormLabel>
                <Select
                  name="pointOfSale"
                  required
                  placeholder="Selecione o ponto de venda"
                  value={pointOfSaleId}
                  onChange={(event) => setPointOfSaleId(event.target.value)}
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
                  isChecked={superUser}
                  onChange={event => setSuperUser(event.target.checked)}
                />
              </FormControl>
            </SimpleGrid>
           
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
      </Grid>
    </>
  );
}
