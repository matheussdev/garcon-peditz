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
  useToast
} from "@chakra-ui/react";
import { FormEvent, useState } from "react";
import api from "../../services/api";
import { CriarNovaMesaModalProps } from "./CriarNovaMesaModal";

export function CriarNovaMesaModal({
  open,
  onCloseModal,
  onSave,
  pointId,
}: CriarNovaMesaModalProps) {
  const [load, setLoad] = useState(false);
  const toast = useToast();
  const [capacidade, setCapacidade] = useState("1");
  const [numeroMesa, setNumeroMesa] = useState("");

  function createTable(e: FormEvent) {
    e.preventDefault();
    setLoad(true);
    if (pointId) {
      api
        .post("api/table", {
          peopleCapacity: Number(capacidade),
          tableNumber: Number(numeroMesa),
          pointOfSaleId: pointId,
        })
        .then((response) => {
          onSave();
        })
        .catch((error) => {
          toast({
            title: "Erro ao criar mesa",
            description:
              error.response.data.message ||
              "Ocorreu um erro ao criar a mesa, tente novamente.",
            status: "error",
            duration: 4000,
            isClosable: true,
          });
        })
        .finally(() => {
          setLoad(false);
        });
    }
  }

  return (
    <Modal onClose={onCloseModal} size="xl" isOpen={open} isCentered>
      <ModalOverlay />
      <ModalContent px={2} py={4}>
        <form action="" onSubmit={createTable}>
          <ModalHeader>Adicionar nova mesa</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid templateColumns="repeat(1fr, 1fr)" gap={4}>
              <Flex flexDirection="column">
                <Flex justifyContent="space-between" gap={4}>
                  <FormControl id="peopleCapacity">
                    <FormLabel>Capacidade</FormLabel>
                    <Select
                      onChange={(event) => {
                        setCapacidade(event.target.value);
                      }}
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
                      onChange={(event) => {
                        setNumeroMesa(event.target.value);
                      }}
                      w="100%"
                      type="number"
                      placeholder="Número da mesa"
                    />
                  </FormControl>
                </Flex>
              </Flex>
              {/* <Flex justifyContent="center" gap={8}>
                <Card 
                  w={200}
                  h={200}
                  display="flex" 
                  justifyContent="center" 
                  alignItems="center"
                  boxShadow="0px 4px 12px rgba(0, 0, 0, 0.2)"
                >
                  {!qrValue &&
                    <Button
                      size="sm"
                      colorScheme={"green"}
                      w={110}
                      onClick={() => setQrValue('https://example.com')}
                    >
                      Gerar QRCode
                  </Button>
                  }
                  {qrValue && (
                    <Flex>
                      <QRCode value={qrValue} size={160} />
                    </Flex>
                  )}
                </Card>
              </Flex> */}
            </Grid>
          </ModalBody>
          <ModalFooter>
            <Flex gap={4} mt={4}>
              <Button isLoading={load} onClick={onCloseModal} colorScheme="red">
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
