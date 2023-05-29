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
  Flex,
  Select,
} from "@chakra-ui/react";
import { useState } from "react";
import api from "../../services/api";
import { telMask } from "../../utils/masks";

import { IngredientModalProps } from "./NewComandaModal";

interface DataSend {
  clientName: string;
  clientPhone: string;
  pointOfSaleId: string;
  referenceCode: string;
  table?: string;
}

export function ComandaModal({
  open,
  onCloseModal,
  onSave,
  posId,
  tables,
}: IngredientModalProps) {
  const [loadSave, setLoadSave] = useState(false);
  const toast = useToast();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [referenceCode, setReferenceCode] = useState("");
  const [commandNumber, setCommandNumber] = useState("");
  const [commandTable, setCommandTable] = useState("");
  function sendIfoodAuth() {
    setLoadSave(true);
    if (posId) {
      let data: DataSend = {
        clientName: name,
        clientPhone: phone,
        pointOfSaleId: posId,
        referenceCode: referenceCode,
      };
      if (commandTable) {
        data = {
          ...data,
          table: commandTable,
        };
      }
      api
        .post("/api/commands", data)
        .then((response) => {
          toast({
            title: "Comanda criada!",
            description: "",
            status: "success",
            duration: 4000,
            isClosable: true,
          });
          onSave();
          setPhone("");
          setName("");
        })
        .catch((err) => {
          toast({
            title: err.response.data.message,
            description: "",
            status: "error",
            duration: 4000,
            isClosable: true,
          });
        })
        .finally(() => {
          setLoadSave(false);
        });
    }
  }

  return (
    <Modal isOpen={open} onClose={onCloseModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Adicionar comanda</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={4} justifyContent="center" alignItems="center">
            <FormLabel htmlFor="pofsale">
              Número personalizado para a comanda
            </FormLabel>
            <Input
              maxLength={5}
              value={referenceCode}
              onChange={(e) => setReferenceCode(e.target.value)}
            />
          </FormControl>
          <FormControl justifyContent="center" alignItems="center">
            <FormLabel htmlFor="pofsale">
              Número da Comanda ou Nome do cliente
            </FormLabel>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </FormControl>
          <FormControl mt={4} justifyContent="center" alignItems="center">
            <FormLabel htmlFor="pofsale">Telefone</FormLabel>
            <Input
              maxLength={15}
              value={phone}
              onChange={(e) => setPhone(telMask(e.target.value))}
            />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="pofsale">Mesas</FormLabel>
            <Flex wrap={"wrap"}>
              <Select
                // display="flex"
                // flexWrap="wrap"
                // gap={4}
                size="sm"
                justifyContent="space-around"
                onChange={(e) => {
                  setCommandTable(e.target.value);
                  console.log(commandTable);
                }}
              >
                <option value="">Selecione uma mesa</option>
                {tables.map((table) => {
                  return (
                    <option key={table.id} value={table.id}>
                      {table.number}
                    </option>
                  );
                })}
              </Select>
            </Flex>
          </FormControl>
        </ModalBody>

        <ModalFooter justifyContent="space-between">
          <Button variant="outline" colorScheme="red" onClick={onCloseModal}>
            Cancelar
          </Button>
          <Button
            isLoading={loadSave}
            onClick={sendIfoodAuth}
            colorScheme="green"
          >
            Salvar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
