import {
  Box,
  Image,
  Text,
  Heading,
  FormControl,
  Flex,
  FormLabel,
  Switch,
  Icon,
} from "@chakra-ui/react";
import { Card } from "../Card";
import IfoodLogo from "../../assets/ifood1.png";
import { FaRegCheckCircle } from "react-icons/fa";
import { IntegrationIfoodProps } from "../../types";

interface IntegrationCardProps{
  integration: IntegrationIfoodProps
}

export const IntegrationCard: React.FC<IntegrationCardProps> = ({integration}) => {
  return (
    <Card minWidth="250px">
      <Box
        borderRadius="50%"
        display="flex"
        justifyContent="center"
        alignItems="center"
        width={120}
        boxShadow="lg"
        mx="auto"
        height={120}
        position="relative"
      >
        <Image src={integration.image.link} borderRadius="50%" height="100%" width="100%" />
        <Box
          borderRadius="50%"
          display="flex"
          justifyContent="center"
          alignItems="center"
          overflow="hidden"
          width={12}
          boxShadow="lg"
          mx="auto"
          position="absolute"
          height={12}
          bottom={-1}
          right={-1}
        >
          <Image src={IfoodLogo} height="100%" width="100%" />
        </Box>
      </Box>

      <Heading textAlign="center" mt={4} as="h6" size="lg">
        {integration.name}
      </Heading>
      <Text
        textAlign="center"
        mt="2"
        fontSize="sm"
        color="green"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Icon as={FaRegCheckCircle} me={"1"} /> Integrado com o Ifood
      </Text>
      <FormControl as={Flex} mt={4} justifyContent="center" alignItems="center">
        <FormLabel htmlFor="active">Ativado:</FormLabel>
        <Switch id="active" />
      </FormControl>
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
