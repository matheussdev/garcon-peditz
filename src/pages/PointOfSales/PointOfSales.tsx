import { Button, Flex, Grid, useToast, SimpleGrid } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { CardLoadSkeleton } from "../../components/CardLoadSkeleton";
import { ConfirmModal } from "../../components/ConfirmModal";
import { EmptyBox } from "../../components/EmptyBox";
import { PointOfSaleCard } from "../../components/PointOfSaleCard";
import api from "../../services/api";
import { logout } from "../../services/auth";

export function PointOfSales() {
  const [points, setPoints] = useState<any[]>([]);
  const [loadingProducts, setLoad] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState("");
  const toast = useToast();
  function getPointsOfSales() {
    setLoad(true);
    api
      .get("/api/point-of-sale")
      .then((response) => {
        setPoints(response.data);
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
    getPointsOfSales();
  }, []);
  function sendDel() {
    api.delete(`api/point-of-sale/${isOpenDelete}`).then(() => {
      setIsOpenDelete("");
      getPointsOfSales();
      toast({
        title: "Ponto de venda excluído!",
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
          to="/pontos-de-vendas/novo"
          leftIcon={<FaPlus />}
          colorScheme="green"
          variant="solid"
        >
          Adicionar ponto de venda
        </Button>
      </Flex>
      <SimpleGrid gap={6} minChildWidth={300}>
        {loadingProducts && <CardLoadSkeleton />}
        {points.length > 0 &&
          !loadingProducts &&
          points.map((c) => (
            <PointOfSaleCard
              point={c}
              onDeleteClick={(id) => setIsOpenDelete(c.id)}
            />
          ))}{" "}
        {points.length === 0 && !loadingProducts && (
          <EmptyBox
            title="Você ainda não possui nenhum ponto de venda adicionado!"
            description={`Clique em "Adicionar ponto de vendas" para começar a adicionar os seus pontos de vendas!`}
          />
        )}
      </SimpleGrid>
      <ConfirmModal
        isOpen={isOpenDelete.length > 0}
        onClose={() => setIsOpenDelete("")}
        onCancel={() => setIsOpenDelete("")}
        onConfirm={sendDel}
        title="Apagar ponto de venda"
        body={
          <>
            Você tem certeza que deseja apagar este ponto de venda?
            <br />
            esta ação não pode ser desfeita!
          </>
        }
      />
    </Grid>
  );
}
