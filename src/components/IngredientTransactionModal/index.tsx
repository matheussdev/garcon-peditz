import {
  Alert,
  AlertIcon, Button, Flex, FormControl,
  FormLabel, Input, InputGroup,
  InputLeftAddon, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select
} from "@chakra-ui/react";
import { FormEvent, useEffect, useState } from "react";
import api from "../../services/api";
import { Ingredienties, PointOfSale } from "../../types";
import { IngredientTransactionModalProps } from "./IngredientTransactionModal";

export function IngredientTransactionModal({
  open,
  onCloseModal,
  onSave,
  pointOfSale,
  ingredient,
}: IngredientTransactionModalProps) {
  const [transaction, setTransaction] = useState({
    ingredientsId: "",
    pointOfSaleId: "",
    price: "",
    value: "",
  });
  const [points, setPoints] = useState<PointOfSale[]>([]);
  const [ingredients, setIngredients] = useState<Ingredienties[]>([]);
  const [load, setLoad] = useState(false);
  const [error, setError] = useState("");
  const [selectedButton, setSelectedButton] = useState("");

  function createUnit(e: FormEvent) {
    e.preventDefault();
    setLoad(true);
    api
      .post(`/api/transactions/ingredients`, {
        ...transaction,
        value: Number(transaction.value),
        price: Number(transaction.price),
        ingredientsId: transaction.ingredientsId,
      })
      .then(() => {
        setTransaction({
          ingredientsId: "",
          pointOfSaleId: "",
          price: "",
          value: "",
        });
        onSave();
      })
      .catch((error) => {
        setError(error.response.data.message);
      })
      .finally(() => {
        setLoad(false);
      });
  }
  
  useEffect(() => {
    if (open) {
      setLoad(true);
      api.get("/api/point-of-sale").then((response) => {
        setPoints(response.data);
      });
      api
        .get("/api/ingredients")
        .then((response) => {
          setIngredients(response.data);
        })
        .finally(() => {
          setLoad(false);
        });
      if (ingredient && pointOfSale) {
        setTransaction({
          price: "",
          value: "",
          ingredientsId: ingredient,
          pointOfSaleId: pointOfSale,
        });
      }
    }
  }, [open, ingredient, pointOfSale]);

  const handleIncome = () => {
    const valor = Math.abs(parseFloat(transaction.price));
    setTransaction({
      ...transaction,
      price: valor.toString(),
    });
    setSelectedButton('entrada');
  }

  const handleOutcome = () => {
    const valor = -Math.abs(parseFloat(transaction.price));
    setTransaction({
      ...transaction,
      price: valor.toString(),
    });
    setSelectedButton('saida');
  }

  return (
    <Modal
      onClose={() => {
        setTransaction({
          ingredientsId: "",
          pointOfSaleId: "",
          price: "",
          value: "",
        });
        onCloseModal();
      }}
      size="xl"
      isOpen={open}
    >
      <ModalOverlay />
      <ModalContent>
        <form action="" onSubmit={createUnit}>
          <ModalHeader>Registre a entrada desse produto no estoque</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {error && (
              <Alert colorScheme="red">
                {" "}
                <AlertIcon /> {error}
              </Alert>
            )}
            <FormControl id="ingredient">
              <FormLabel>Produto</FormLabel>
              <Select
                w="100%"
                placeholder="Selecione..."
                onChange={(e) =>
                  setTransaction({
                    ...transaction,
                    ingredientsId: e.target.value,
                  })
                }
                value={transaction.ingredientsId}
                required
              >
                {ingredients.map((x) => (
                  <option key={x.id} value={x.id}>
                    {x.title}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl id="stockmin" mt={4}>
              <FormLabel htmlFor="stockmin">Quantidade</FormLabel>
              <InputGroup>
                <Input
                  onChange={(e) =>
                    setTransaction({
                      ...transaction,
                      value: e.target.value,
                    })
                  }
                  w="100%"
                  type="number"
                  value={transaction.value}
                  placeholder="Ex: 10"
                />
              </InputGroup>
            </FormControl>
            <FormControl id="stockmin" mt={4}>
              <FormLabel htmlFor="stockmin">Preço</FormLabel>
              <Flex mb={2} gap={2}>
                <Button 
                  size="sm" 
                  colorScheme="green"
                  variant={selectedButton === 'entrada' ? 'solid' : 'outline'} 
                  onClick={handleIncome}
                >
                  Entrada
                </Button>
                <Button
                  size="sm"
                  colorScheme="red" 
                  variant={selectedButton === 'saida' ? 'solid' : 'outline'} 
                  onClick={handleOutcome}
                >
                  Saída
                </Button>
              </Flex>
              <InputGroup>
                <InputLeftAddon children="R$" />
                <Input
                  onChange={(e) =>
                    setTransaction({
                      ...transaction,
                      price: e.target.value,
                    })
                  }
                  w="100%"
                  type="number"
                  placeholder="Ex: 10"
                  value={transaction.price}
                />
              </InputGroup>
            </FormControl>
            <FormControl id="point" mt={4}>
              <FormLabel>Ponto de venda</FormLabel>
              <Select
                w="100%"
                placeholder="Selecione..."
                onChange={(e) =>
                  setTransaction({
                    ...transaction,
                    pointOfSaleId: e.target.value,
                  })
                }
                value={transaction.pointOfSaleId}
                required
              >
                {points.map((x) => (
                  <option key={x.id} value={x.id}>
                    {x.name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter mt={4}>
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
              Salvar
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
