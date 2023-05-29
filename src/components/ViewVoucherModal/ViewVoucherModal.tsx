import { Badge, Box, Button, Flex, IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Tooltip } from "@chakra-ui/react";
import { AiOutlinePrinter } from "react-icons/ai";
import { FiShare } from "react-icons/fi";
import "./style.css";

export interface ViewVoucherModalProps {
  open: boolean;
  onClose: () => void;
}

export function ViewVoucherModal({ open, onClose }: ViewVoucherModalProps) {
  return (
    <Modal onClose={onClose} isOpen={open} size="xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <form action="">
          <ModalHeader>
            <ModalCloseButton />
          </ModalHeader>
          <ModalBody pb={8}>
            <Flex justifyContent="center">
              <span className="custom_voucher-start"></span>
              <Box
                p={6}
                borderWidth={1}
                borderRadius="md"
                boxShadow="lg"
                bgGradient='linear(to-r, green.100, green.300)'
                width="400px"
              >
                <Flex justifyContent="space-between" alignItems="center" mb={5}>
                  <Text fontWeight="bold" fontSize="lg">
                    Voucher Quiosque do Bicicletão
                  </Text>
                  <Badge colorScheme="green">ATIVO</Badge>
                </Flex>
                <Text color="gray.600" mb={4} ml={10} fontSize="1.8rem">
                  6K8J****
                </Text>
                <Flex justifyContent="flex-end">
                  <Text color="gray.600" fontSize="sm">
                    Válido até 31 de dezembro de 2023
                  </Text>
                </Flex>
              </Box>
              <span className="custom_voucher-end"></span>
            </Flex>
            <Flex mt={8} justifyContent="center">
              <Flex justifyContent="flex-start" flexDirection="column" gap={1}>
                <Text><strong>Nome do cliente:</strong> João da Silva Souza</Text>
                <Text><strong>Email:</strong> carval***********@gmail.com</Text>
                <Text><strong>CPF:</strong> 067.1**.***-** </Text>
                <Text><strong>Telefone:</strong> (**) *****-8041</Text>
                <Text><strong>Valor do voucher:</strong> R$ 35,00</Text>
              </Flex>
            </Flex>
            <Flex justifyContent="center" mt={8} gap={2}>
              <Tooltip label='Imprimir' placement="bottom">
                <IconButton
                  aria-label="Imprimir"
                  variant={"solid"}
                  rounded="full"
                  colorScheme={"blue"}
                  icon={<AiOutlinePrinter />}
                  size={"sm"}
                  fontSize={"1.2rem"}
                />
              </Tooltip>
              <Tooltip label='Compartilhar' placement="bottom">
                <IconButton
                  aria-label="Compartilhar"
                  variant={"solid"}
                  rounded="full"
                  colorScheme={"blue"}
                  icon={<FiShare />}
                  size={"sm"}
                  fontSize={"1.2rem"}
                />
              </Tooltip>
            </Flex>
          </ModalBody>
          <ModalFooter pt="0">
            <Button colorScheme="red" onClick={onClose}>
              Fechar
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}