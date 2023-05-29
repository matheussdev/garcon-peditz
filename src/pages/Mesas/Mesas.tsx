import { Button, Flex, Select, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { CardLoadSkeleton } from "../../components/CardLoadSkeleton";
import { CriarNovaMesaModal } from "../../components/CriarNovaMesaModal";
import { EditarMesaModal } from "../../components/EditarMesaModal";
import { MesaCard } from "../../components/MesaCard";
import api from "../../services/api";
import { PointOfSale } from "../../types";

export function Mesas() {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [isNovaMesaModalOpen, setIsNovaMesaModalOpen] = useState(false);
  const [isEditarMesaModalOpen, setEditarMesaModalOpen] = useState(false);
  const [pointToFilter, setPointToFilter] = useState("");
  const [points, setPoints] = useState<PointOfSale[]>([]);
  const [selectTable, setSelectTable] = useState<{
    id: string;
    name: string;
    number: number;
  }>();
  const [mesas, setMesas] = useState<
    {
      id: string;
      name: string;
      number: number;
      peopleCapacity: number;
    }[]
  >([]);

  function getMesas(pid: string) {
    setLoading(true);
    api.get(`/api/table/${pid}`).then((response) => {
      setMesas(response.data);
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
      setLoading(false);
    });
  }

  useEffect(() => {
    api.get("/api/point-of-sale").then((response) => {
      const pointId = response.data[0].id;
      setPoints(response.data);
      setPointToFilter(pointId);
      getMesas(pointId);
    });
  }, []);

  return (
    <>
      <Flex>
        <Button
          leftIcon={<FaPlus />}
          colorScheme="green"
          variant="solid"
          onClick={() => setIsNovaMesaModalOpen(true)}
        >
          Adicionar nova mesa
        </Button>
      </Flex>
      <Select
        maxW="300px"
        mt="4"
        background="white"
        value={pointToFilter}
        onChange={(e) => {
          const mesaId = e.target.value;
          setPointToFilter(mesaId);
          getMesas(mesaId);
        }}
      >
        {points ? (
          points.map((point) => (
            <option key={point.id} value={point.id}>
              {point.name}
            </option>
          ))
        ) : (
          <option value="">Nenhum ponto de venda encontrado</option>
        )}
      </Select>
      {loading && <CardLoadSkeleton />}
      <Flex mt={8} gap={3} justifyContent="start" flexWrap="wrap">
        {mesas.map((mesa) => (
          <MesaCard
            name={
              "para " + mesa.peopleCapacity + " pessoa" + (mesa.number > 1 ? "s" : "")
            }
            number={mesa.number.toString()}
            isAvailable={true}
            onEditClick={() => {
              setEditarMesaModalOpen(true);
              setSelectTable(mesa);
            }}
          />
        ))}
      </Flex>

      <CriarNovaMesaModal
        open={isNovaMesaModalOpen}
        onCloseModal={() => {
          setIsNovaMesaModalOpen(false);
        }}
        onSave={() => {
          setIsNovaMesaModalOpen(false);
          getMesas(pointToFilter);
        }}
        pointId={pointToFilter}
      />
      <EditarMesaModal
        open={isEditarMesaModalOpen}
        onCloseModal={() => {
          setEditarMesaModalOpen(false);
        }}
        update={() => getMesas(pointToFilter)}
        table={selectTable}
        pointId={pointToFilter}
      />
    </>
  );
}
