import { Button, Flex, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import { DatePickerRangeInput } from "../CalendarInput/CalendarInput";
import IntlCurrencyInput from "react-intl-currency-input";
import { currencyConfig } from "../../utils/currency";
import "./style.css";

export interface CreateVoucherModalProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
}

export function CreateVoucherModal({ open, onClose, onSave }: CreateVoucherModalProps) {
  return (
    <Modal onClose={onClose} isOpen={open} size="xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <form action="">
          <ModalHeader>
            Criar novo voucher
            <ModalCloseButton />
          </ModalHeader>
          <ModalBody pb={8}>
            <FormControl id="voucherValue" mb={3}>
              <FormLabel>Valor do voucher</FormLabel>
              <IntlCurrencyInput
                currency="BRL"
                config={currencyConfig}
                className="voucher-price-input"
              />
            </FormControl>
            <FormControl id="clientName">
              <FormLabel>Nome do cliente</FormLabel>
              <Input
                w="100%"
                type="text"
                placeholder="Nome do cliente"
                required
              />
            </FormControl>
            <FormControl id="clientEmail" mt={3}>
              <FormLabel>E-mail</FormLabel>
              <Input
                w="100%"
                type="email"
                placeholder="E-mail"
              />
            </FormControl>
            <Flex justifyContent="space-between" gap={4} mt={3}>
              <FormControl id="clientEmail">
                <FormLabel>CPF</FormLabel>
                <Input
                  w="100%"
                  type="number"
                  placeholder="CPF"
                />
              </FormControl>
              <FormControl id="clientPhone">
                <FormLabel>Telefone</FormLabel>
                <Input
                  w="100%"
                  type="tel"
                  placeholder="(DDD) 99999-9999"
                  maxLength={15}
                />
              </FormControl>
            </Flex>
            <Flex mt={4}>
              <DatePickerRangeInput />
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Flex gap={4}>
              <Button colorScheme="red" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" colorScheme="green">
                Salvar
              </Button>
            </Flex>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}