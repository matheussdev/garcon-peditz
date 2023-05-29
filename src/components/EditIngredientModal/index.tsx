import {
  Button, chakra, Flex, FormControl,
  FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, SimpleGrid, useToast
} from "@chakra-ui/react";
import { FormEvent, useEffect, useState } from "react";
import api from "../../services/api";
import { EditIngredientModalProps, Ingredient, Unities } from "./EditIngredientModal";

export function EditIngredientModal({
  open,
  onSave,
  onCloseModal,
  ingredient,
  selectedIngredientId
}: EditIngredientModalProps) {
  const toast = useToast();
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient>();
  const [unities, setUnities] = useState<Unities[]>([]);
  const [load, setLoad] = useState(false);

  const updateIngredient = (event: FormEvent) => {
    event.preventDefault();
    setLoad(true);
    
    api.patch(`/api/ingredients/${selectedIngredientId}`, {
      title: selectedIngredient?.title,
      minimumStock: Number(selectedIngredient?.minimumStock),
      ean: selectedIngredient?.ean,
      unitMeasure: selectedIngredient?.unitMeasure,
    })
      .then(response => {
        const obj = response.data;
        setSelectedIngredient({
          ...obj,
        })
        toast({
          title: "Ingrediente editado!",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
        onSave();
      })
      .catch(() => {
        toast({
          title: "Ocorreu um erro ao editar ingrediente!",
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
    setSelectedIngredient(ingredient);

    api.get("/api/unit").then((response) => {
      setUnities(response.data);
    });
  }, [ingredient]);

  return (
    <Modal onClose={() => onCloseModal()} size="2xl" isOpen={open}>
      <ModalOverlay />
      <ModalContent>
        <chakra.form action="" onSubmit={updateIngredient}>
          <ModalHeader>Editar ingrediente</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SimpleGrid columns={2} minChildWidth="200px" gap={4} mt={4}>
              <FormControl id="ingredient">
                <FormLabel>Ingrediente</FormLabel>
                <Input
                  name="ingredient"
                  type="text" 
                  required
                  value={selectedIngredient?.title}
                  placeholder="Nome do ingrediente"
                  onChange={(e) =>
                    setSelectedIngredient({ ...selectedIngredient, title: e.target.value } as Ingredient)
                  }
                />
              </FormControl>
              <FormControl id="ean">
                <FormLabel>Código de barras</FormLabel>
                <Input
                  name="ean"
                  type="text"
                  required
                  value={selectedIngredient?.ean}
                  placeholder="Código de barras"
                  onChange={(e) =>
                    setSelectedIngredient({ 
                      ...selectedIngredient, 
                      ean: e.target.value 
                    }  as Ingredient)}
                />
              </FormControl>
            </SimpleGrid>
            <SimpleGrid columns={2} minChildWidth="200px" gap={4} mt={4}>
              <FormControl id="unitMeasure">
                <FormLabel>Unidade de medidas</FormLabel>
                  <Select
                    w="100%"
                    value={selectedIngredient?.unitMeasure}
                    placeholder="Selecione..."
                    onChange={(e) =>
                      setSelectedIngredient({
                        ...selectedIngredient,
                        unitMeasure: e.target.value,
                      } as Ingredient)}
                  >
                    {unities.map((x) => (
                      <option key={x.id} value={x.id}>
                        {x.unit}
                      </option>
                    ))}
                  </Select>
              </FormControl>
              <FormControl id="minimumStock">
                <FormLabel>Estoque mínimo</FormLabel>
                <Input
                  name="minimumStock"
                  type="number"
                  required
                  value={selectedIngredient?.minimumStock}
                  placeholder="Estoque mínimo"
                  onChange={(e) =>
                    setSelectedIngredient({
                      ...selectedIngredient,
                      minimumStock: e.target.value,
                    } as Ingredient)}
                />
              </FormControl>
            </SimpleGrid>
          </ModalBody>
          <ModalFooter mt={5}>
            <Flex>
              <Button
                onClick={() => {
                  onCloseModal();
                }}
                colorScheme="red"
                mr="4"
              >
                Cancelar
              </Button>
              <Button 
                isLoading={load}
                type="submit" 
                colorScheme="green"
              >
                Salvar alterações
              </Button>
            </Flex>
          </ModalFooter>
        </chakra.form>
      </ModalContent>
    </Modal>
  );
}
