import {
  Box,
  Heading,
  Flex,
  IconButton,
  Tooltip,
  Image,
  Button,
} from "@chakra-ui/react";
import { Card } from "../Card";
import { BiTrash } from "react-icons/bi";
import { BsEye } from "react-icons/bs";
import { Link } from "react-router-dom";
import { MdMenuBook } from "react-icons/md";

interface MenuCardProps {
  onNewOrderClick?: () => void;
  onViewClick?: () => void;
  image: string;
  name: string;
  id: string;
  onDeleteClick?: (id: string) => void;
}
export const MenuCard: React.FC<MenuCardProps> = ({
  onNewOrderClick,
  onViewClick,
  name,
  image,
  id,
  onDeleteClick,
}) => {
  return (
    <Card
      width="570px"
      p={0}
      h="250px"
      display={"flex"}
      flexDirection="column"
      alignItems="center"
      justifyContent="space-around"
    >
      <Box
        borderRadius="full"
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="100px"
        boxShadow="lg"
        mx="auto"
        height="100px"
        position="relative"
        bg="gray.200"
        color="gray.500"
      >
        {image ? (
          <Image
            src={image}
            alt={`${name} image`}
            borderRadius="full"
            boxSize="100%"
          />
        ) : (
          <MdMenuBook size={31} />
        )}
      </Box>

      <Heading
        maxW="200px"
        // noOfLines={1}
        textAlign="center"
        // alignSelf="center"
        mt={-6}
        as="h6"
        size="md"
      >
        {name}
      </Heading>
      {/* <Text
        textAlign="center"
        mt="2"
        fontSize="xs"
        color="gray"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Icon as={PhoneIcon} me={"1"} /> (99) 99194-7191
      </Text> */}
      <Flex justifyContent="center" gap={3} mb={4} w="100%">
        <Tooltip label="Visualizar" placement="bottom">
          <Link to={`/cardapios/${id}`}>
            <Button
              aria-label="Visualizar"
              colorScheme="blue"
              borderRadius="10px"
              variant="solid"
              size="sm"
              p={2}
              width="150px"
              onClick={onViewClick}
            >
              Visualizar
            </Button>
          </Link>
        </Tooltip>
        <Tooltip label={"Excluir Cardapio"} placement="bottom">
          <Button
            size="sm"
            aria-label="Excluir"
            colorScheme="red"
            borderRadius="10px"
            variant="solid"
            p={2}
            width="150px"
            onClick={() => onDeleteClick && onDeleteClick(id)}
          >
            Excluir Cardapio
          </Button>
        </Tooltip>
      </Flex>
      {/* <Flex>
      <Button
        mt={2}
        mx="auto"
        leftIcon={<SiIfood />}
        colorScheme="green"
        variant="solid"
        onClick={() => generateIfoodCode()}
      >
        Configurar
      </Button>
    </Flex> */}
    </Card>
  );
};
