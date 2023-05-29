import {
  Button,
  Flex,
  Grid,
  Divider,
  useMediaQuery,
  Heading,
  useToast,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Input,
  useDisclosure,
} from "@chakra-ui/react";
import { FocusableElement } from "@chakra-ui/utils";
import { LegacyRef, RefObject, useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { FiFilter } from "react-icons/fi";
import { Link } from "react-router-dom";
import { CardLoadSkeleton } from "../../components/CardLoadSkeleton";
import { ConfirmModal } from "../../components/ConfirmModal";
import { EmptyBox } from "../../components/EmptyBox";

import { ProductCard } from "../../components/ProductCard";
import api from "../../services/api";
import { logout } from "../../services/auth";

export function Products() {
  const [isLargerThan1280, isLargerThan700, isLargerThan1600] = useMediaQuery([
    "(min-width: 1280px)",
    "(min-width: 700px)",
    "(min-width: 1600px)",
  ]);
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoad] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState("");
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();

  function getProducts() {
    setLoad(true);
    api
      .get("/api/products/category")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((err) => {
        if (err.response.data.statusCode === 401) {
          logout();
        }
      })
      .finally(() => {
        setLoad(false);
      });
  }

  useEffect(() => {
    getProducts();
  }, []);
  
  function handleDeleteProduct(id: string) {
    setIsOpenDelete(id);
  }

  function sendDel() {
    api.delete(`api/products/${isOpenDelete}`).then(() => {
      setIsOpenDelete("");
      getProducts();
      toast({
        title: "Produto excluído!",
        description: "",
        status: "info",
        duration: 4000,
        isClosable: true,
      });
    });
  }

  return (
    <Grid gap={4}>
      <Flex justify={"space-between"} mb="6">
        <Button
          as={Link}
          to="/produtos/adicionar"
          leftIcon={<FaPlus />}
          colorScheme="green"
          variant="solid"
        >
          Adicionar produto
        </Button>
        <Button
          leftIcon={<FiFilter />}
          ref={btnRef as unknown as LegacyRef<HTMLButtonElement>}
          onClick={onOpen}
          colorScheme="blue"
          variant="outline"
        >
          Filtro
        </Button>
      </Flex>
      {loadingProducts && <CardLoadSkeleton />}
      {products.length > 0 &&
        !loadingProducts &&
        products.map((c) => (
          <>
            <Flex alignItems={"center"}>
              <Heading color={"gray.400"} fontSize="xl">
                {c.title}
              </Heading>
              <Divider my={8} ml={4} />
            </Flex>
            <Grid
              gap={4}
              gridTemplateColumns={
                isLargerThan700
                  ? isLargerThan1280
                    ? isLargerThan1600
                      ? "1fr 1fr 1fr 1fr 1fr"
                      : "1fr 1fr 1fr 1fr"
                    : "1fr 1fr"
                  : "1fr"
              }
            >
              {c.products.map((item: any) => (
                <ProductCard
                  key={item.id}
                  product={item}
                  ondelete={(id) => handleDeleteProduct(id)}
                />
              ))}
            </Grid>
          </>
        ))}
      {!loadingProducts && products.length === 0 && (
        <EmptyBox
          title="Você ainda não possui nenhum produto adicionado!"
          description={`Clique em "Adicionar produto" para começar a adicionar os seus produtos`}
        />
      )}
      <ConfirmModal
        isOpen={isOpenDelete.length > 0}
        onClose={() => setIsOpenDelete("")}
        onCancel={() => setIsOpenDelete("")}
        onConfirm={sendDel}
        title="Apagar produto"
        body={
          <>
            Você tem certeza que deseja apagar este produto?
            <br />
            Esta ação não poderá ser desfeita!
          </>
        }
      />
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef as unknown as RefObject<FocusableElement>}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Filtro</DrawerHeader>

          <DrawerBody>
            <Input placeholder="Pesquise aqui" />
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme="blue">Buscar</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Grid>
  );
}
