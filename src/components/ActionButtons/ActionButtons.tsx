import { HStack, IconButton, Tooltip } from "@chakra-ui/react";
import { BiEdit, BiTrash } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

interface UserProps {
  id: string,
  name: string,
  email: string,
  telephone: string,
  password:string,
  pointOfSaleId: string,
  superUser: boolean
}

interface DeleteButtonProps {
  user: UserProps;
  onDelete: (id: string) => void;
}

export const ActionButtons: React.FC<DeleteButtonProps> = ({ user, onDelete }) => {
  const navigate = useNavigate();

  return (
    <>
      <HStack>
        <Tooltip label='Editar' placement="left">
          <IconButton
            aria-label="Editar"
            variant={"solid"}
            rounded="full"
            colorScheme={"blue"}
            icon={<BiEdit />}
            size={"sm"}
            fontSize={"1.2rem"}
            onClick={() => navigate(`edit/${user.id}`)}
          />
        </Tooltip>
        <Tooltip label='Excluir' placement="bottom">
          <IconButton
            aria-label="Editar"
            variant={"solid"}
            rounded="full"
            colorScheme={"red"}
            icon={<BiTrash />}
            size={"sm"}
            fontSize={"1.2rem"}
            onClick={() => onDelete(user.id)}
          />
        </Tooltip>
      </HStack>
    </>
  );
}
