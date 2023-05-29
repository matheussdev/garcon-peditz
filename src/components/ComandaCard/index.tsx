import { Box, Heading, Flex, IconButton, Tooltip, Button } from "@chakra-ui/react";
import { Card } from "../Card";
import { BiShare } from "react-icons/bi";
import { DownloadIcon } from "@chakra-ui/icons";
import { BsEye } from "react-icons/bs";
interface ComandaCardProps {
  onNewOrderClick?: () => void;
  onViewClick: () => void;
  number: string;
  name: string;
}
export const ComandaCard: React.FC<ComandaCardProps> = ({
  onNewOrderClick,
  onViewClick,
  name,
  number,
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
        {/* <Image src={integration.image.link} borderRadius="50%" height="100%" width="100%" /> */}
        {/* <BiReceipt size={30}/> */}
        <Heading>{number}</Heading>
      </Box>

      <Heading
        maxW="100px"
        noOfLines={1}
        textAlign="center"
        mt={4}
        as="h6"
        size="sm"
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
      <Flex justifyContent="center" gap={1} mt={2}>
        <Tooltip label="Vizualizar" placement="bottom">
          <Button
            mt={4}
            aria-label="Abrir Comanda"
            background="green.500"
            color="white"
            variant="solid"
            size="sm"
          onClick={onViewClick}
          > Abrir Comanda</Button>
        </Tooltip>
        {/* <Tooltip label={"Lançar pedidos"} placement="bottom">
          <IconButton
            mt={2}
            size="sm"
            aria-label="lançar"
            icon={<BiShare />}
            colorScheme="green"
            borderRadius="full"
            variant="solid"
            onClick={onNewOrderClick}
            ></IconButton>
        </Tooltip> */}
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
