import { Button, Flex, HStack, IconButton, Input, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverFooter, PopoverHeader, PopoverTrigger, Portal, Table, TableContainer, Tbody, Td, Th, Thead, Tooltip, Tr } from "@chakra-ui/react";
import { useState } from "react";
import { BiEdit } from "react-icons/bi";
import { BsEye } from "react-icons/bs";
import { FaPlus } from "react-icons/fa";
import { FiFilter } from "react-icons/fi";
import { IoCloseSharp } from "react-icons/io5";
import { DatePickerRangeInput } from "../../components/CalendarInput/CalendarInput";
import { ConfirmModal } from "../../components/ConfirmModal";
import { CreateVoucherModal } from "../../components/CreateVoucherModal/CreateVoucherModal";
import { ViewVoucherModal } from "../../components/ViewVoucherModal/ViewVoucherModal";

export function Vouchers() {
  const [isCreateVoucherModalOpen, setIsCreateVoucherModalOpen] = useState(false);
  const [isViewVoucherModalOpen, setIsViewVoucherModalOpen] = useState(false);
  const [isInactivate, setIsInactivate] = useState(false);

  return (
    <>
      <Flex justify={"space-between"}>
        <Button
          leftIcon={<FaPlus />}
          colorScheme="green"
          variant="solid"
          onClick={() => setIsCreateVoucherModalOpen(true)}
        > Criar novo voucher </Button>
        <Popover placement='left-end'>
          <PopoverTrigger>
            <Button leftIcon={<FiFilter />} colorScheme="green" variant="outline">Filtro</Button>
          </PopoverTrigger>
          <Portal>
            <PopoverContent>
              <PopoverArrow />
              <PopoverHeader fontWeight="bold">Filtrar voucher</PopoverHeader>
              <PopoverCloseButton />
              <PopoverBody>
                <Flex mt={4} mb={4} gap={2} justifyContent="center">
                  <Button size="xs" colorScheme="blue">
                    Crescente
                  </Button>
                  <Button size="xs" colorScheme="blue">
                    Descrescente
                  </Button>
                </Flex>
                <Input placeholder="Pesquise aqui" />
                <Flex mt={4}>
                  <DatePickerRangeInput />
                </Flex>
              </PopoverBody>
              <PopoverFooter>
                <Flex gap={4} justifyContent="end">
                  <Button colorScheme="red">
                    Cancelar
                  </Button>
                  <Button colorScheme="green">
                    Filtrar
                  </Button>
                </Flex>
              </PopoverFooter>
            </PopoverContent>
          </Portal>
        </Popover>
      </Flex>

      <Flex gap={6} mt="4" w="100%" flexDirection="column">
        <TableContainer w="100%" bg="white" shadow="md">
          <Table>
            <Thead>
              <Tr>
                <Th>Nome do cliente</Th>
                <Th>Valor do voucher</Th>
                <Th>Data de início</Th>
                <Th>Data de expiração</Th>
                <Th>Ação</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>Fulano da Silva</Td>
                <Td>R$ 35,00</Td>
                <Td>22/05/2023</Td>
                <Td>29/05/2023</Td>
                <Td>
                  <HStack>
                    <Tooltip label='Visualizar' placement="bottom">
                      <IconButton
                        aria-label="Visualizar"
                        variant={"solid"}
                        rounded="full"
                        colorScheme={"blue"}
                        icon={<BsEye />}
                        size={"sm"}
                        fontSize={"1.2rem"}
                        onClick={() => setIsViewVoucherModalOpen(true)}
                      />
                    </Tooltip>
                    <Tooltip label='Editar' placement="left">
                      <IconButton
                        aria-label="Editar"
                        variant={"solid"}
                        rounded="full"
                        colorScheme={"blue"}
                        icon={<BiEdit />}
                        size={"sm"}
                        fontSize={"1.2rem"}
                      />
                    </Tooltip>
                    <Tooltip label='Desativar' placement="bottom">
                      <IconButton
                        aria-label="Desativar"
                        variant={"solid"}
                        rounded="full"
                        colorScheme={"red"}
                        icon={<IoCloseSharp />}
                        size={"sm"}
                        fontSize={"1.2rem"}
                        onClick={() => setIsInactivate(true)}
                      />
                    </Tooltip>
                  </HStack>
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      </Flex>

      <CreateVoucherModal
        open={isCreateVoucherModalOpen}
        onClose={() => setIsCreateVoucherModalOpen(false)}
        onSave={() => setIsCreateVoucherModalOpen(false)}
      />

      <ViewVoucherModal
        open={isViewVoucherModalOpen}
        onClose={() => setIsViewVoucherModalOpen(false)}
      />

      <ConfirmModal
        buttonTitle="Desativar"
        isOpen={isInactivate}
        onClose={() => setIsInactivate(false)}
        onCancel={() => setIsInactivate(false)}
        onConfirm={() => { }}
        title="Desativar voucher"
        body={
          <>
            Você tem certeza que deseja desativar este voucher?
            <br />
            Esta ação não poderá ser desfeita!
          </>
        }
      />
    </>
  );
}