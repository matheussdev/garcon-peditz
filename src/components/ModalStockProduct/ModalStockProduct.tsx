import { Box, Button, chakra, Divider, Flex, FormControl, FormLabel, Heading, IconButton, Input, InputGroup, InputLeftAddon, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Tooltip, useDisclosure, useToast } from "@chakra-ui/react";
import { FormEvent, useEffect, useState } from "react";
import { BsArrowLeftShort, BsEye } from "react-icons/bs";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import api from "../../services/api";
import "./style.css";

interface EstoqueProduto {
  id: string,
  stock: number,
  pointOfSale: {
    id: string,
    name: string,
  },
  product: {
    id: string,
    name: string
  }
}

interface Props {
  productId: string;
  onCloseModal: () => void;
}

export const ModalStockProduct = ({ productId, onCloseModal }: Props) => {
  const [transaction, setTransaction] = useState({
    productId: "",
    pointOfSaleId: "",
    price: "",
    value: "",
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [secondModalIsOpen, setSecondModalIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<EstoqueProduto | null>(null);
  const [load, setLoad] = useState(false);
  const [estoque, setEstoque] = useState<any[]>([]);
  const [productName, setProductName] = useState("");
  const [selectedButton, setSelectedButton] = useState("");
  const toast = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalClose = () => {
    setIsModalOpen(false);
    onClose();
    onCloseModal();
  };

  const handleOpenSecondModal = (item: EstoqueProduto) => {
    setSelectedItem(item);
    setSecondModalIsOpen(true);
  };

  const handleCloseSecondModal = () => {
    setSecondModalIsOpen(false);
  };

  const handleIncome = () => {
    const valor = Math.abs(parseFloat(transaction.value));
    setTransaction({
      ...transaction,
      value: valor.toString(),
    });
    setSelectedButton('entrada');
  }

  const handleOutcome = () => {
    const valor = -Math.abs(parseFloat(transaction.value));
    setTransaction({
      ...transaction,
      value: valor.toString(),
    });
    setSelectedButton('saida');
  }

  function getProductsStock() {
    api
    .get(`/api/stock/product/${productId}`)
      .then((response) => {
        setEstoque(response.data);
        setProductName(response.data[0].product.name);
      })
      .catch((error) => {
        toast({
          title: error.message,
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      })
      .finally(() => {
        setLoad(false);
    });
  }

  function updateProductStock(event: FormEvent) {
    event.preventDefault();

    setLoad(true);

    api
      .post(`/api/transactions/products`, {
        ...transaction,
        value: Number(transaction.value),
        price: Number(transaction.price),
        productId: selectedItem!.product.id,
        pointOfSaleId: selectedItem!.pointOfSale.id,
      })
      .then(() => {
        setTransaction({
          productId: "",
          pointOfSaleId: "",
          price: "",
          value: "",
        });
        handleCloseSecondModal();
        getProductsStock();
      })
      .catch((error) => {
        toast({
          title: error.message,
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      })
      .finally(() => {
        setLoad(false);
      });
  }

  useEffect(() => {
    if(isOpen) {
      getProductsStock();
    }
  }, [isOpen]);

  return (
    <>
      <Tooltip label='Adicionar estoque' placement="bottom">
        <IconButton
          aria-label="Adicionar estoque do produto"
          variant={"solid"}
          rounded="full"
          colorScheme={"blue"}
          icon={<BsEye />}
          size={"sm"}
          fontSize={"1.2rem"}
          onClick={onOpen}
        />
      </Tooltip>
      <Modal 
        isOpen={isOpen} 
        onClose={handleModalClose}
        size="lg"
        isCentered
      >
        <ModalOverlay />
        <ModalContent h={500}>
          <ModalHeader className="custom-header">
            <Text className="custom-header-title">Registrar estoque de produto</Text>
            <ModalCloseButton />
          </ModalHeader>
          <Heading
            textAlign="center"
            as='h4'
            size='md'
            mt={2}
          > {productName}
          </Heading>
          <ModalBody>
          {estoque.map((estoqueProduto) => (
            <><Flex
              mb="4"
              mt="4"
              justifyContent="space-between"
              alignItems="center"
              key={estoqueProduto.id}
            >
              <Flex gap={2} justifyContent="left" alignItems="center">
                <Box
                  borderRadius="50%"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  width={"60px"}
                  height={"60px"}
                  boxShadow="lg"
                  position="relative"
                  bg="gray.200"
                  color="gray.600"
                  gap={0.5}
                >
                  <Heading
                    textAlign="center"
                    as='h4' size='md'
                  >
                    {estoqueProduto.stock}
                  </Heading>
                </Box>
                <Text fontSize='md'>{estoqueProduto.pointOfSale.name}</Text>
              </Flex>
              <Flex>
                <Button
                  size="sm"
                  onClick={() => handleOpenSecondModal(estoqueProduto)}
                  color="green"
                  background="transparent"
                  _hover={{
                    background: "white",
                    color: "green.500",
                  }}
                >
                  Criar Registro
                  <MdOutlineKeyboardArrowRight fontSize={"1.3rem"} />
                </Button>
              </Flex>
            </Flex>
            <><Divider/></></>
          ))}
          </ModalBody>
        </ModalContent>
      </Modal>
      {selectedItem && (
        <Modal 
          isOpen={secondModalIsOpen} 
          onClose={handleCloseSecondModal}
          size="lg"
          isCentered
        >
          <ModalContent h={500}>
            <chakra.form action="" onSubmit={updateProductStock}>
              <ModalHeader className="custom-header">
                  <Box
                    cursor="pointer"
                    fontSize={"1.8rem"}
                    bottom={2}
                    right={3}
                    onClick={handleCloseSecondModal}
                  >
                    <BsArrowLeftShort />
                  </Box>
                  <Text>Registrar estoque do produto</Text>
                <ModalCloseButton />
              </ModalHeader>
              <Heading
                textAlign="center"
                as='h4'
                size='md'
                mt={2}
              > {selectedItem.product.name}
              </Heading>
              <ModalBody>
                <Flex justifyContent="left" alignItems="center" gap={2}>
                  <Box
                    borderRadius="50%"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    width={"60px"}
                    height={"60px"}
                    boxShadow="lg"
                    position="relative"
                    bg="gray.200"
                    color="gray.600"
                    gap={0.5}
                  >
                    <Heading
                      textAlign="center"
                      as='h4' size='md'
                    >
                      {selectedItem.stock}
                    </Heading>
                  </Box>
                  <Text fontSize='md'>{selectedItem.pointOfSale.name}</Text>
                </Flex>
                <Divider mt={4} />
                <FormControl id="stockmin" mt={4}>
                  <Flex mb={6} mt={4} gap={4} justifyContent="center">
                    <Button
                      size="sm" 
                      colorScheme="green"
                      variant={selectedButton === 'entrada' ? 'solid' : 'outline'} 
                      onClick={handleIncome}
                    >
                      Entrada
                    </Button>
                    <Button
                      size="sm"
                      colorScheme="red" 
                      variant={selectedButton === 'saida' ? 'solid' : 'outline'} 
                      onClick={handleOutcome}
                    >
                      Saída
                    </Button>
                  </Flex>
                  <FormLabel htmlFor="stockmin">Quantidade</FormLabel>
                  <InputGroup>
                    <Input
                      onChange={(e) =>
                        setTransaction({
                          ...transaction,
                          value: e.target.value,
                        })
                      }
                      w="100%"
                      type="number"
                      value={transaction.value}
                      placeholder="Ex: 10"
                    />
                  </InputGroup>
                </FormControl>
                <FormControl id="stockmin" mt={4}>
                  <FormLabel htmlFor="stockmin">Preço</FormLabel>
                    <InputGroup>
                      <InputLeftAddon children="R$" />
                      <Input
                        onChange={(e) =>
                          setTransaction({
                            ...transaction,
                            price: e.target.value,
                          })
                        }
                        w="100%"
                        type="number"
                        placeholder="Ex: 10"
                        value={transaction.price}
                      />
                    </InputGroup>
                </FormControl>
              </ModalBody>
              <ModalFooter mt={6}>
                <Flex gap={2}>
                  <Button
                    onClick={handleCloseSecondModal}
                    colorScheme="red"
                    mr="auto"
                  >
                    Cancelar
                  </Button>{" "}
                  <Button isLoading={load} type="submit" colorScheme="green">
                    Registrar
                  </Button>
                </Flex>
              </ModalFooter>
            </chakra.form>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};
