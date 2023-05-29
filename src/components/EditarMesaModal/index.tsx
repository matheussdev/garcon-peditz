import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { EditarMesaModalProps } from "./EditarMesaModal";
import api from "../../services/api";

export function EditarMesaModal({
  open,
  onCloseModal,
  table,
  update,
}: EditarMesaModalProps) {
  const [load, setLoad] = useState(false);
  const [capacidade, setCapacidade] = useState("1");
  const [numeroMesa, setNumeroMesa] = useState("");

  function deleteTable() {
    api.delete(`/api/table/${table?.id}`).then(() => {
      onCloseModal();
      update();
    });
  }

  useEffect(() => {
    if (open && table) {
      setCapacidade(table.number.toString());
      setNumeroMesa(table.name);
    }
  }, [open, table]);

  return (
    <Modal onClose={onCloseModal} size="xl" isOpen={open} isCentered>
      <ModalOverlay />
      <ModalContent px={2} py={4}>
        <form action="">
          <ModalHeader>Editar mesa</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid templateColumns="repeat(1fr, 1fr)" gap={4}>
              <Flex flexDirection="column">
              <Flex justifyContent="space-between" gap={4}>
                <FormControl id="peopleCapacity">
                  <FormLabel>Capacidade</FormLabel>
                  <Select
                    value={capacidade}
                    onChange={(e) => setCapacidade(e.target.value)}
                  >
                    <option value="1">1 pessoa</option>
                    <option value="2">2 pessoas</option>
                    <option value="3">3 pessoas</option>
                    <option value="4">4 pessoas</option>
                    <option value="5">5 pessoas</option>
                    <option value="6">6 pessoas</option>
                    <option value="7">7 pessoas</option>
                    <option value="8">8 pessoas</option>
                    <option value="9">9 pessoas</option>
                    <option value="10">10 pessoas</option>
                    <option value="11">11 pessoas</option>
                    <option value="12">12 pessoas</option>
                    <option value="13">13 pessoas</option>
                    <option value="14">14 pessoas</option>
                    <option value="15">15 pessoas</option>
                  </Select>
                </FormControl>
                <FormControl id="tableNumber">
                  <FormLabel>Número da mesa</FormLabel>
                  <Input
                    onChange={(e) => setNumeroMesa(e.target.value)}
                    value={numeroMesa}
                    w="100%"
                    type="text"
                    placeholder="Número da mesa"
                  />
                </FormControl>
              </Flex>
              <Flex justifyContent="flex-end">
                <Button onClick={deleteTable} colorScheme="red" mt={4} maxW={120}>
                  Excluir mesa
                </Button>
              </Flex>
            </Flex>
            </Grid>
          </ModalBody>
          <ModalFooter>
            <Flex gap={4} mt={4}>
              <Button onClick={onCloseModal} colorScheme="red">
                Cancelar
              </Button>
              <Button isLoading={load} type="submit" colorScheme="green">
                Salvar
              </Button>
            </Flex>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
