import { Button, Flex, Grid, Text, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { EmptyBox } from "../../components/EmptyBox";
import { MenuCard } from "../../components/MenuCard";
import api from "../../services/api";
import { ConfirmModal } from "../../components/ConfirmModal";

export interface IProduct {
  name: string;
  storage: number;
  price: number;
}

export interface IMenu {
  title: string;
  image?: string;
  products: IProduct[];
  pointOfSales: string;
  id: string;
}

export function Menus() {
  const navigate = useNavigate();
  const [menus, setMenus] = useState<Array<IMenu>>([]);
  const [deleteMenuOpen, setDeleteMenuOpen] = useState("");
  const [load, setLoad] = useState(false);
  const toasts = useToast();
  function deleteCatalog() {
    setLoad(true);
    api
      .delete(`/api/catalogs/${deleteMenuOpen}`)
      .then((response) => {
        setMenus(menus.filter((menu) => menu.id !== deleteMenuOpen));
        setDeleteMenuOpen("");
        toasts({
          title: "Cardápio excluído com sucesso!",
          status: "info",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((error) => {
        console.log(error);
        toasts({
          title: "Erro ao excluir cardápio!",
          description: error.response.data.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      })
      .finally(() => {
        setLoad(false);
      });
  }
  useEffect(() => {
    api
      .get("/api/catalogs")
      .then((response) => {
        setMenus(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <Grid gap={4}>
      <Flex justify={"space-between"} mb="6">
        <Button
          // disabled
          leftIcon={<FaPlus />}
          colorScheme="green"
          variant="solid"
          onClick={() => {
            // setNewMenuOpen(true);
            navigate("/cardapios/adicionar");
          }}
        >
          Adicionar cardápio
        </Button>
      </Flex>
      {menus.length === 0 ? (
        <EmptyBox
          title="Você ainda não possui nenhum cardápio adicionado!"
          description={`Clique em "Adicionar cardápio" para começar a adicionar os seus
          cardápios`}
        />
      ) : (
        <Flex gap={5} justifyContent="space-between" flexWrap="wrap">
          {menus.map((menu, index) => {
            return (
              <MenuCard
                key={index}
                image={menu.image ? menu.image : ""}
                name={menu.title}
                id={menu.id}
                onDeleteClick={() => setDeleteMenuOpen(menu.id)}
              />
            );
          })}
        </Flex>
      )}
      <ConfirmModal
        isOpen={deleteMenuOpen !== ""}
        onClose={() => setDeleteMenuOpen("")}
        onCancel={() => setDeleteMenuOpen("")}
        title="Excluir Cardapio"
        body={<Text>Tem certeza que deseja excluir este cardapio?</Text>}
        onConfirm={deleteCatalog}
        onLoad={load}
      />
    </Grid>
  );
}
