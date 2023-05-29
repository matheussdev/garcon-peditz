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
  InputGroup,
  InputRightAddon,
  FormControl,
  FormLabel,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import api from "../../services/api";
import { telMask } from "../../utils/masks";

export interface IngredientModalProps {
  open: boolean;
  onCloseModal: () => void;
  onSave: () => void;
  percentage: number;
  setPercentage: (value: number) => void;
  title: string;
  calculate: () => void;
}

export function DiscountOrTaxModal({
  open,
  onCloseModal,
  onSave,
  percentage,
  setPercentage,
  title,
  calculate,
}: IngredientModalProps) {
  const [loadSave, setLoadSave] = useState(false);
  const [applying, setApplying] = useState(0);

  function newPercentage() {
    if (applying > 100) {
      setPercentage(100);
    } else {
      setPercentage(applying);
    }
    calculate();
    onSave();
  }

  function cancelModal() {
    setPercentage(0);
    onCloseModal();
  }

  return (
    <Modal isOpen={open} onClose={onCloseModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Adicionar {title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl justifyContent="center" alignItems="center">
            <FormLabel htmlFor="pofsale">{title} em %</FormLabel>
            <InputGroup>
              <Input
                value={applying}
                maxLength={3}
                // onChange={(e) => setApplying(e.target.value)}
                type="number"
              />
              <InputRightAddon children="%" />
            </InputGroup>
          </FormControl>
        </ModalBody>

        <ModalFooter justifyContent="space-between">
          <Button variant="outline" colorScheme="red" onClick={cancelModal}>
            Cancelar
          </Button>
          <Button
            isLoading={loadSave}
            onClick={newPercentage}
            colorScheme="blue"
          >
            Salvar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
