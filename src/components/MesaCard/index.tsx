import { Box, Flex, Heading, IconButton, Text, Tooltip } from "@chakra-ui/react";
import { BiEdit } from "react-icons/bi";
import { BsEye } from "react-icons/bs";
import { Link } from "react-router-dom";
import { Card } from "../Card";

interface MesaCardProps {
  onEditClick: () => void;
  number: string;
  name: string;
  isAvailable: boolean;
}

export const MesaCard: React.FC<MesaCardProps> = ({
  onEditClick,
  name,
  number,
  isAvailable,
}) => {
  return (
    <Card minWidth="150px" p={6}>
      <Box
        borderRadius="50%"
        display="flex"
        justifyContent="center"
        alignItems="center"
        width={"60px"}
        boxShadow="lg"
        mx="auto"
        height={"60px"}
        position="relative"
        bg="gray.200"
        color="gray.500"
      >
        <Heading>{number}</Heading>
      </Box>
      <Heading
        maxW="140px"
        noOfLines={1}
        textAlign="center"
        mt={4}
        as="h6"
        size="sm"
      >
        {name}
      </Heading>
      <Text
        textAlign="center"
        fontWeight="bold"
        fontSize="0.8rem"
        color={isAvailable ? "green" : "red"}
        size="sm"
      >
        {isAvailable ? "DISPONÍVEL" : "OCUPADA"}
      </Text>
      <Flex justifyContent="center" gap={1} mt={2}>
        <Tooltip label="Editar Mesa" placement="bottom">
          <IconButton
            mt={2}
            aria-label="Editar Mesa"
            icon={<BiEdit />}
            colorScheme="blue"
            borderRadius="full"
            variant="solid"
            size="sm"
            onClick={onEditClick}
          ></IconButton>
        </Tooltip>
        <Tooltip label="Visualizar mesa" placement="bottom">
        <Link to={`/mesas/visualizar`}>
          <IconButton
            mt={2}
            aria-label="Visualizar mesa"
            icon={<BsEye />}
            colorScheme="blue"
            borderRadius="full"
            variant="solid"
            size="sm"
          ></IconButton>
        </Link>
        </Tooltip>
      </Flex>
    </Card>
  );
};
