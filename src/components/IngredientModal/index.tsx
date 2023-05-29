import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { FormEvent, useEffect, useState } from "react";
import api from "../../services/api";

import { IngredientModalProps } from "./IngredientModal";
interface unities {
  id: string;
  unit: string;
}

export function IngredientModal({
  open,
  onCloseModal,
  onSave,
}: IngredientModalProps) {
  const [ingredient, setIngredient] = useState({
    title: "",
    minimumStock: "",
    ean: "",
    unitMeasure: "",
  });
  const [unities, setUnities] = useState<unities[]>([]);
  const [load, setLoad] = useState(false);
  function createUnit(e: FormEvent) {
    e.preventDefault();
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
    <Modal onClose={() => onCloseModal()} size="4xl" isOpen={open}>
      <ModalOverlay />
      <ModalContent>
        <form action="" onSubmit={createUnit}>
          <ModalHeader>Crie um novo ingrediente</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl id="title">
              <FormLabel htmlFor="title">Ingrediente</FormLabel>
              <Input
                w="100%"
                required
                value={ingredient.title}
                onChange={(e) =>
                  setIngredient({ ...ingredient, title: e.target.value })
                }
                placeholder="Ex: queijo..."
              />
            </FormControl>
            <FormControl id="ean" mt={4}>
              <FormLabel htmlFor="ean">Código de barras</FormLabel>
              <Input
                w="100%"
                onChange={(e) =>
                  setIngredient({ ...ingredient, ean: e.target.value })
                }
                value={ingredient.ean}
                placeholder="Ex: 3129038123"
              />
            </FormControl>
            <FormControl id="nome" mt={4}>
              <FormLabel>Unidade de medida</FormLabel>
              <Select
                w="100%"
                onChange={(e) =>
                  setIngredient({
                    ...ingredient,
                    unitMeasure: e.target.value,
                  })
                }
                value={ingredient.unitMeasure}
                required
              >
                <option>Unidade</option>
                {unities.map((x) => (
                  <option key={x.id} value={x.id}>
                    {x.unit}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl id="stockmin" mt={4}>
              <FormLabel htmlFor="stockmin">Estoque mínimo</FormLabel>
              <Input
                onChange={(e) =>
                  setIngredient({
                    ...ingredient,
                    minimumStock: e.target.value,
                  })
                }
                w="100%"
                type="number"
                value={ingredient.minimumStock}
                placeholder="Ex: 10"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter mt={10}>
            <Button
              onClick={() => {
                onCloseModal();
              }}
              colorScheme="red"
              mr="auto"
            >
              Cancelar
            </Button>{" "}
            <Button isLoading={load} type="submit" colorScheme="green">
              Adicionar
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
