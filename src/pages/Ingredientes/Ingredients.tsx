import { SearchIcon } from "@chakra-ui/icons";
import { Button, chakra, Flex, Grid, Input, InputGroup, InputLeftElement, Spacer, Table, TableContainer, Tbody, Td, Th, Thead, Tr, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { AddNewIngredientModal } from "../../components/AddNewIngredientModal";
import { CardLoadSkeleton } from "../../components/CardLoadSkeleton";
import { ConfirmModal } from "../../components/ConfirmModal";
import { EditIngredientModal } from "../../components/EditIngredientModal";
import { EmptyBox } from "../../components/EmptyBox";
import { ThreeActionButtons } from "../../components/ThreeActionButtons/ThreeActionButtons";
import { ViewIngredientModal } from "../../components/ViewIngredientModal/ViewIngredientModal";
import api from "../../services/api";

export function Ingredients() {
  const toast = useToast();
  const [loadingIngredients, setLoadingIngredients] = useState(false);
  const [ingredientId, setIngredientId] = useState("");

  const [addOpenModal, setAddOpenModal] = useState(false);
  const [openViewIngredientModal, setOpenViewIngredientModal] = useState(false);
  const [openEditIngredientModal, setOpenEditIngredientModal] = useState(false);

  const [ingredients, setIngredients] = useState<any[]>([]);
  const [selectedIngredientId, setSelectedIngredientId] = useState<string>("");
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  function getAllIngredients() {
    setLoadingIngredients(true);
    api
      .get(`/api/ingredients`)
      .then((response) => {
        setIngredients(response.data);
        setSearchResults(response.data);
      })
      .catch((error) => {
        toast({
          title: error.message,
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      })
      .finally(() => {
        setLoadingIngredients(false);
      });
  }

  function handleDeleteProduct(id: string) {
    setIngredientId(id);
  }

  function deleteIngrendient() {
    setLoadingIngredients(true);
    api.delete(`api/ingredients/${ingredientId}`)
      .then(() => {
        setIngredientId("");
        const updatedUsers = ingredients.filter((ingredient) => ingredient.id !== ingredientId);
        setSearchResults(updatedUsers);
        toast({
          title: "Ingrediente excluído!",
          status: "info",
          duration: 4000,
          isClosable: true,
        });
      })
      .catch(() => {
        toast({
          title: "Erro ao excluir ingrediente!",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      })
      .finally(() => {
        setLoadingIngredients(false);
      });
  }

  useEffect(() => {
    getAllIngredients();
  }, []);

  useEffect(() => {
    setSearchResults(
      ingredients.filter(
        (ingredient) =>
          ingredient.title.toLowerCase().includes(searchText.toLowerCase())
      )
    );
  }, [ingredients, searchText]);

  return (
    <>
      <Flex>
        <Button
          leftIcon={<FaPlus />}
          colorScheme="green"
          variant="solid"
          onClick={() => setAddOpenModal(true)}
        >
          Adicionar novo ingrediente
        </Button>
        <Spacer />
        <chakra.form action="">
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
      <Grid gap="4">
        <Flex gap={6} mt="4" w="100%" flexDirection="column">
          {loadingIngredients && <CardLoadSkeleton />}
          {ingredients.length > 0 && (
            <Flex w={"100%"} >
              <TableContainer w="100%" bg="white" shadow="md">
                <Table>
                  <Thead>
                    <Tr>
                      <Th>Ingrediente</Th>
                      <Th>Código de barras</Th>
                      <Th>Unidade de medidas</Th>
                      <Th>Estoque mínimo</Th>
                      <Th>Ação</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {searchResults.map((ingredient) => (
                      <Tr key={ingredient.id}>
                        <Td>{ingredient.title}</Td>
                        <Td>{ingredient.ean}</Td>
                        <Td>{ingredient.unitMeasure.unit}</Td>
                        <Td>{ingredient.minimumStock}</Td>
                        <Td>
                          <ThreeActionButtons
                            ingredient={ingredient}
                            onDelete={(id) => handleDeleteProduct(id)}
                            onView={(id) => {
                              setSelectedIngredientId(id);
                              setOpenViewIngredientModal(true)
                            }}
                            onEditIngredient={(id) => {
                              setSelectedIngredientId(id);
                              setOpenEditIngredientModal(true);
                            }}
                          />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </Flex>
          )}
          {ingredients.length === 0 && !loadingIngredients && (
            <EmptyBox
              title="Você ainda não possui nenhum ingrediente adicionado!"
              description={`Clique em "Criar novo ingrediente" para adicionar um novo ingrediente.`}
            />
          )}
          <ConfirmModal
            isOpen={ingredientId.length > 0}
            onClose={() => setIngredientId("")}
            onCancel={() => setIngredientId("")}
            onConfirm={deleteIngrendient}
            title="Apagar ingrediente"
            body={
              <>
                Você tem certeza que deseja apagar este ingrediente?
                <br />
                Esta ação não pode ser desfeita!
              </>
            }
          />
        </Flex>
        <AddNewIngredientModal
          open={addOpenModal}
          onSave={() => {
            setAddOpenModal(false);
            getAllIngredients();
          }}
          onCloseModal={() => setAddOpenModal(false)}
        />
        <ViewIngredientModal
          open={openViewIngredientModal}
          onCloseModal={() => setOpenViewIngredientModal(false)}
          ingredient={ingredients.find((ingredient) => ingredient.id === selectedIngredientId)}
          selectedIngredientId={selectedIngredientId}
        />
        <EditIngredientModal
          open={openEditIngredientModal}
          ingredient={ingredients.find((ingredient) => ingredient.id === selectedIngredientId)}
          selectedIngredientId={selectedIngredientId}
          onSave={() => {
            setOpenEditIngredientModal(false);
            getAllIngredients();
          }}
          onCloseModal={() => setOpenEditIngredientModal(false)}
        />
      </Grid>
    </>
  );
}
