import { Button, Center, Flex, Grid, Select, Table, TableContainer, Tbody, Td, Th, Thead, Tr, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { FcCancel, FcCheckmark } from "react-icons/fc";
import { Link } from "react-router-dom";
import { ActionButtons } from "../../components/ActionButtons/ActionButtons";
import { CardLoadSkeleton } from "../../components/CardLoadSkeleton";
import { ConfirmModal } from "../../components/ConfirmModal";
import { EmptyBox } from "../../components/EmptyBox";
import api from "../../services/api";
import { PointOfSale } from "../../types";
import { telMask } from "../../utils/masks";

export function Users() {
  const toast = useToast();
  const [loadingUsers, setLoad] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState("");

  const [users, setUsers] = useState<any[]>([]);
  const [pointName, setPointName] = useState("");
  const [pointToFilter, setPointToFilter] = useState("");
  const [points, setPoints] = useState<PointOfSale[]>([]);

  function getUsersFilter(filter?: string) {
    setLoad(true);
    api
      .get(`/api/collaborators${filter || ""}`)
      .then((response) => {
        setUsers(response.data.collaborators);
        setPointName(response.data.name);
      })
      .catch(() => {
        toast({
          title: "Erro ao listar usuários!",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      })
      .finally(() => {
        setLoad(false);
      });
  }

  function handleDeleteProduct(id: string) {
    setIsOpenDelete(id);
  }

  function deleteUser() {
    setLoad(true)
    api.delete(`api/collaborators/${isOpenDelete}`).then(() => {
      setIsOpenDelete("");
      const updatedUsers = users.filter((user) => user.id !== isOpenDelete);
      setUsers(updatedUsers);
      toast({
        title: "Usuário excluído!",
        description: "",
        status: "info",
        duration: 4000,
        isClosable: true,
      });
    })
    .catch(() => {
      toast({
        title: "Erro ao excluir usuário!",
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
    api.get("/api/point-of-sale").then((response) => {
      const pointId = response.data[0].id;
      setPoints(response.data);
      setPointToFilter(pointId);
      getUsersFilter(`?pointOfSaleId=${pointId}`);
    });
  }, []);

  return (
    <>
      <Flex>
      <Button
          as={Link}
          to="/users/create"
          leftIcon={<FaPlus />}
          colorScheme="green"
          variant="solid"
        >
          Adicionar novo usuário
        </Button>
      </Flex>
      <Grid gap="4">
        <Flex gap={6} mt="4" w="100%" flexDirection="column">
          <Select
            maxW="300px"
            background="white"
            value={pointToFilter}
            placeholder="Selecione um ponto de venda"
            onChange={(e) => {
              setPointToFilter(e.target.value);
              getUsersFilter(`?pointOfSaleId=${e.target.value}`);
            }}
          >
            {points.map(point =>
              <option key={point.id} value={point.id}>{point.name}</option>
            )}
          </Select>
          {loadingUsers && <CardLoadSkeleton />}
          {users.length > 0 && (
            <Flex w={"100%"} >
              <TableContainer w="100%" bg="white" shadow="md">
                <Table>
                  <Thead>
                    <Tr>
                      <Th>Nome do funcionário</Th>
                      <Th>E-mail</Th>
                      <Th>Telefone</Th>
                      <Th>Empresa</Th>
                      <Center>
                        <Th>É administrador?</Th>
                      </Center>
                      <Th>Ação</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {users.map((employee) => (
                      <Tr key={employee.id}>
                        <Td>{employee.name}</Td>
                        <Td>{employee.email}</Td>
                        <Td>{telMask(employee.telephone)}</Td>
                        <Td>{pointName}</Td>
                        <Center>                          
                        <Td>
                          {
                            employee.superUser ?  
                            <FcCheckmark /> :
                            <FcCancel />
                          }
                        </Td>
                        </Center>
                        <Td>
                          <ActionButtons
                            user={employee}
                            onDelete={(id) => handleDeleteProduct(id)}
                          ></ActionButtons>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </Flex>
          )}{" "}
          {users.length === 0 && !loadingUsers && (
            <EmptyBox
              title="Você ainda não possui nenhum funcionário cadastrado nesse ponto de venda!"
              description={`Clique em "Adicionar novo usuário" para adicionar novos funcionários.`}
            />
          )}
          <ConfirmModal
            isOpen={isOpenDelete.length > 0}
            onClose={() => setIsOpenDelete("")}
            onCancel={() => setIsOpenDelete("")}
            onConfirm={deleteUser}
            title="Apagar usuário"
            body={
              <>
                Você tem certeza que deseja apagar este usuário?
                <br />
                esta ação não pode ser desfeita!
              </>
            }
          />
        </Flex>
      </Grid>
    </>
  );
}
