import { Button, Flex, Heading, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { EmptyBox } from "../EmptyBox";
import { IngredientsCard } from "../IngredientsCard";
import { Ingredient, ViewIngredientModalProps } from "./index";

export function ViewIngredientModal({
  open,
  onCloseModal,
  ingredient,
}: ViewIngredientModalProps) {
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient>();

  useEffect(() => {
    setSelectedIngredient(ingredient);
  }, [ingredient]);

  return (
    <>
      <Modal onClose={() => onCloseModal()} size="4xl" isOpen={open}>
      <ModalOverlay />
        <ModalContent>
          <ModalHeader>Estoque do ingrediente em todos os pontos</ModalHeader>
          <Heading
            noOfLines={1}
            textAlign="center"
            mt={4}
            as="h6"
          >
            {selectedIngredient?.title}
          </Heading>
          <ModalBody>
            <Flex mt={4} gap={3} justifyContent="center" flexWrap="wrap">
              {selectedIngredient?.stocks?.map((stock) => (
                <IngredientsCard
                  key={stock.id}
                  name={stock.pointOfSale.name}
                  number={stock.stock}
                  unit={selectedIngredient.unitMeasure?.unit}
                />
              ))}
            </Flex>
            {selectedIngredient?.stocks?.length === 0 && (
              <EmptyBox
                title="Você ainda não possui estoque para esse ingrediente!"
                description={`Por favor, adicione o estoque!`}
              />
            )}
          </ModalBody>
          <ModalFooter mt={10} gap={4}>
            <Button
              onClick={() => {
                onCloseModal();
              }}
              colorScheme="red"
            >
              Fechar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}