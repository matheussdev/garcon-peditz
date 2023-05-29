import { HStack, IconButton, Tooltip } from "@chakra-ui/react";
import { BiEdit, BiTrash } from "react-icons/bi";
import { BsEye } from "react-icons/bs";

interface IngredientProps {
  id: string,
  title: string,
  minimumStock: number,
  ean: string,
  unitMeasure: string,
  stocks?: Stocks[],
}

interface Stocks {
  id: string,
  minimumStock: number,
  stock: number,
  pointOfSale: {
  id: string,
  name:string
  }
}
interface ThreeActionButtonsProps {
  ingredient: IngredientProps;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
  onEditIngredient:(id: string) => void;
}

export const ThreeActionButtons: React.FC<ThreeActionButtonsProps> = ({ ingredient, onDelete, onView, onEditIngredient }) => {
  return (
    <>
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
            onClick={() => {
              onView(ingredient.id);
            }}
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
            onClick={() => onEditIngredient(ingredient.id)}
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
            onClick={() => onDelete(ingredient.id)}
          />
        </Tooltip>
      </HStack>
    </>
  );
}
