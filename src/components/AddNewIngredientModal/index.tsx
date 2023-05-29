import {
  Button, chakra, Flex, FormControl,
  FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, SimpleGrid, useToast
} from "@chakra-ui/react";
import { FormEvent, useEffect, useState } from "react";
import api from "../../services/api";

import { AddNewIngredientModalProps } from "./AddNewIngredientModal.types";

interface Unities {
  id: string;
  unit: string;
}

export function AddNewIngredientModal({
  open,
  onSave,
  onCloseModal,
}: AddNewIngredientModalProps) {
  const toast = useToast();
  const [ingredient, setIngredient] = useState({
    title: "",
    minimumStock: "",
    ean: "",
    unitMeasure: "",
  });
  const [unities, setUnities] = useState<Unities[]>([]);
  const [load, setLoad] = useState(false);

  function createNewIngredient(event: FormEvent) {
    event.preventDefault();
    setLoad(true);
    api
      .post("/api/ingredients", {
        ...ingredient,
        minimumStock: Number(ingredient.minimumStock),
      })
      .then(() => {
        setIngredient({
          title: "",
          minimumStock: "",
          ean: "",
          unitMeasure: "",
        });
        onSave();
      })
      .catch(error => {
        if(error.response.status === 404) {
          toast({
            title: "O código de barras informado não é válido.",
            status: "info",
            duration: 4000,
            isClosable: true,
          });
        }
      })
      .finally(() => {
        setLoad(false);
      });
  }

  useEffect(() => {
    api.get("/api/unit").then((response) => {
      setUnities(response.data);
    });
  }, []);

  return (
    <Modal onClose={
      () => onCloseModal()} 
      size="2xl" 
      isOpen={open}
    >
      <ModalOverlay />
      <ModalContent>
        <chakra.form action="" onSubmit={createNewIngredient}>
          <ModalHeader>Adicionar ingrediente</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SimpleGrid columns={2} minChildWidth="200px" gap={4} mt={4}>
              <FormControl id="ingredient">
                <FormLabel>Ingrediente</FormLabel>
                <Input
                  name="ingredient"
                  type="text"
                  required
                  value={ingredient.title}
                  placeholder="Nome do ingrediente"
                  onChange={(e) =>
                    setIngredient({ ...ingredient, title: e.target.value })
                  }
                />
              </FormControl>
              <FormControl id="ean">
                <FormLabel>Código de barras</FormLabel>
                <Input
                  name="ean"
                  type="text"
                  value={ingredient.ean}
                  placeholder="Código de barras"
                  onChange={(e) =>
                    setIngredient({ ...ingredient, ean: e.target.value })
                  }
                />
              </FormControl>
            </SimpleGrid>
            <SimpleGrid columns={2} minChildWidth="200px" gap={4} mt={4}>
              <FormControl id="unitMeasure">
                <FormLabel>Unidade de medidas</FormLabel>
                  <Select
                    w="100%"
                    value={ingredient.unitMeasure}
                    placeholder="Selecione..."
                    onChange={(e) =>
                      setIngredient({
                        ...ingredient,
                        unitMeasure: e.target.value,
                      })
                    }
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
                  value={ingredient.minimumStock}
                  placeholder="Estoque mínimo"
                  onChange={(e) =>
                    setIngredient({
                      ...ingredient,
                      minimumStock: e.target.value,
                    })
                  }
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
                Salvar ingrediente
              </Button>
            </Flex>
          </ModalFooter>
        </chakra.form>
      </ModalContent>
    </Modal>
  );
}
