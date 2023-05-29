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
  FormControl,
  FormLabel,
  useToast,
  Select,
} from "@chakra-ui/react";
import { useState } from "react";
import api from "../../services/api";
import { PasswordField } from "../PasswordField";
import { currencyConfig } from "../../utils/currency";
import IntlCurrencyInput from "react-intl-currency-input";

import { OpenCaixaModalProps } from "./CloseCaixaModal";
export function CloseCaixaModal({
  open,
  onCloseModal,
  onSave,
  pId,
}: OpenCaixaModalProps) {
  const [loadSave, setLoadSave] = useState(false);
  const toast = useToast();
  const [price, setPrice] = useState(0);
  const [password, setPassword] = useState("");
  function sendBox() {
    api
      .post("/api/trading-box/close", {
        pointOfSaleId: pId,
        userPassword: password,
      })
      .then(() => {
        onSave();
      });
  }
  return (
    <Modal isOpen={open} onClose={onCloseModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Fechar caixa</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mt={4} justifyContent="center" alignItems="center">
            <PasswordField
              register={true}
              label="Senha do operador"
              onChange={(event) => setPassword(event.target.value)}
              value={password}
            />
          </FormControl>
        </ModalBody>

        <ModalFooter justifyContent="space-between">
          <Button variant="outline" colorScheme="red" onClick={onCloseModal}>
            Cancelar
          </Button>
          <Button
            isLoading={loadSave}
            onClick={sendBox}
            colorScheme="blue"
          >
            Salvar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
