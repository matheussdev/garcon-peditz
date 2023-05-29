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

import { OpenCaixaModalProps } from "./OpenCaixaModal";
export function OpenCaixaModal({
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
      .post("/api/trading-box/open", {
        initialValue: price,
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
        <ModalHeader>Adicionar comanda</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl justifyContent="center" alignItems="center">
            <FormLabel htmlFor="pofsale">Valor inicial</FormLabel>
            <IntlCurrencyInput
              currency="BRL"
              config={currencyConfig}
              className="phoneInput"
              value={price}
              onChange={(event: any, value: number, maskedValued: string) =>
                setPrice(value)
              }
            />
          </FormControl>
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
