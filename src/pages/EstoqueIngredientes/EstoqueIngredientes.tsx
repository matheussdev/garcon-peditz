import { ArrowDownIcon, ArrowUpIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Box, chakra,
  Flex,
  Grid, Input, InputGroup, InputLeftElement, Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead, Tr
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { EmptyBox } from "../../components/EmptyBox";
import { ModalStockIngredient } from "../../components/ModalStockIngredient/ModalStockIngredient";
import { RowLoadSkeleton } from "../../components/RowLoadSkeleton";
import api from "../../services/api";
import { logout } from "../../services/auth";

export function EstoqueIngredientes() {
  const [estoque, setEstoque] = useState<any[]>([]);
  const [loadingIngredients, setLoad] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  function getStock(filter?: string) {
    setLoad(true);
    api
      .get(`/api/ingredients${filter || ""}`)
      .then((response) => {
        setEstoque(response.data);
        setSearchResults(response.data);
      })
      .catch((err) => {
        if (err.response?.data.statusCode === 401) {
          logout();
        }
      })
      .finally(() => {
        setLoad(false);
      });
  }
  
  function getIngredients() {
    setLoad(true);
    getStock();
    api
      .get("/api/transactions/ingredients")
      .then((response) => {
        setTransactions(response.data);
      })
      .catch((err) => {
        if (err.response.data.statusCode === 401) {
          logout();
        }
      })
      .finally(() => {
        setLoad(false);
      });
  }

  const handleGetAll = () => {
    getStock();
    getIngredients();
  };

  useEffect(() => {
    getIngredients();
  }, []);

  useEffect(() => {
    setSearchResults(
      estoque.filter(
        (x) =>
          x.title.toLowerCase().includes(searchText.toLowerCase())
      )
    );
  }, [estoque, searchText]);

  return (
    <Grid gap={4}>
      <Flex>
        <chakra.form
          action=""
        >
          <InputGroup w='320px'>
            <InputLeftElement
              pointerEvents='none'
              children={<SearchIcon color='gray.300' />}
            />
            <Input 
              type='text' 
              placeholder='Procurar ingrediente...'
              background="white"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </InputGroup>
        </chakra.form>
      </Flex>
      {loadingIngredients && <RowLoadSkeleton />}
      <Grid gridTemplateColumns="1fr 0.5fr" gap="4">
        <Flex gap={6} w="100%" flexDirection="column">
          {searchResults.length > 0 && (
            <Flex w={"100%"}>
              <TableContainer w="100%" bg="white" shadow="md">
                <Table>
                  <Thead>
                    <Tr>
                      <Th>Ingrediente</Th>
                      <Th>Estoque mínimo</Th>
                      <Th>Estoque total</Th>
                      <Th>Ação</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {searchResults.map((ingredient) => (
                      <Tr key={ingredient.id}>
                        <Td>{ingredient.title}</Td>
                        <Td>{ingredient.minimumStock}</Td>
                        <Td>{ingredient.stocks.stock}</Td>
                        <Td>
                          <ModalStockIngredient ingredintId={ingredient.id} onCloseModal={handleGetAll}/>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </Flex>
          )}{" "}
          {searchResults.length === 0 && !loadingIngredients && (
            <EmptyBox
              title="Você ainda não possui nenhum ingrediente no estoque deste ponto de venda!"
            />
          )}
        </Flex>
        <Flex gap={6} w="100%">
          {transactions.length > 0 && (
            <Box w={"100%"} maxH={460} overflowY="scroll">
              <TableContainer w="100%" bg="white" shadow="md">
                <Table>
                  <Thead>
                    <Tr>
                      <Th></Th>
                      <Th>Ingrediente</Th>
                      <Th>Ponto de venda</Th>
                      <Th>Quantidade</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {transactions.map((x) => (
                      <Tr key={x.id}>
                        <Td>
                          {x.value > 0 ? (
                            <Box
                              background="green.100"
                              borderRadius="full"
                              h="30px"
                              w="30px"
                              display="flex"
                              alignItems="center"
                              color="green.600"
                              justifyContent="center"
                            >
                              <ArrowUpIcon />
                            </Box>
                          ) : (
                            <Box
                              background="red.100"
                              borderRadius="full"
                              h="30px"
                              w="30px"
                              display="flex"
                              alignItems="center"
                              color="red.600"
                              justifyContent="center"
                            >
                              <ArrowDownIcon />
                            </Box>
                          )}
                        </Td>
                        <Td>{x.ingredients.title}</Td>
                        <Td>{x.pointOfSale.name}</Td>
                        <Td color={x.value > 0 ? "green.500" : "red.500"}>
                          {x.value}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </Box>
          )}{" "}
          {transactions.length === 0 && !loadingIngredients && (
            <EmptyBox
              title="Você ainda não possui nenhum estoque adicionado!"
            />
          )}
        </Flex>
      </Grid>
    </Grid>
  );
}
