import { CheckCircleIcon } from "@chakra-ui/icons";
import {
  Box, Flex, Grid, Heading, Icon, Text
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { useNavigate } from "react-router-dom";
import { Card } from "../../components/Card";

export function MesaView() {
  const navigate = useNavigate();
  const [qrValue, setQrValue] = useState('');

  useEffect(() => {
    setQrValue('https://example.com');
  }, []);

  return (
    <Grid gridTemplateColumns={"3fr 1fr"} gap={6}>
        <Card display="flex" gap="10rem">
          <Flex flexDirection="column">
            <Flex align="center" justifyContent="start" mb={8}>
              <Box
                borderRadius="50%"
                display="flex"
                justifyContent="center"
                alignItems="center"
                width={"60px"}
                boxShadow="lg"
                height={"60px"}
                position="relative"
                bg="gray.200"
                color="gray.500"
              >
                <>
                  {" "}
                  <Heading>{"01"}</Heading>
                </>
              </Box>
              <Heading as="h4" size="md" textAlign="start" ms={3}>
                Mesa 01
                <br />
                <Text
                  textAlign="center"
                  fontSize="xs"
                  color={"green"}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  mt={1}
                >
                  <>
                    <Icon as={CheckCircleIcon} me={"3"} /> Mesa disponível
                  </>
                </Text>
              </Heading>
            </Flex>

            <Flex gap={3} alignItems="center" mb="5">
              <Heading as="h4" size="md">Garçom:</Heading>
              <Text>Fulano da Silva</Text>
            </Flex>
            <Box overflowY="auto" w="550px" maxH="350px" paddingRight={4} cursor="pointer">
              <Flex
                align="center"
                justifyContent="space-between"
                background="gray.100"
                padding="4"
                borderRightRadius={"xl"}
                borderLeft="4px solid"
                borderLeftColor="green.400"
                mb="4"
                onClick={() => navigate(`/comandas/92c990c4-3260-477d-845a-72e56ab80e5c`)}
              >
                <Text>
                  Comanda 1
                </Text>
              </Flex>
            </Box>
            <Box overflowY="auto" w="550px" maxH="350px" paddingRight={4} cursor="pointer">
              <Flex
                align="center"
                justifyContent="space-between"
                background="gray.100"
                padding="4"
                borderRightRadius={"xl"}
                borderLeft="4px solid"
                borderLeftColor="green.400"
                mb="4"
                onClick={() => navigate(`/comandas/92c990c4-3260-477d-845a-72e56ab80e5c`)}
              >
                <Text>
                  Comanda 2
                </Text>
              </Flex>
            </Box>
          </Flex>
          <Flex flexDirection="column" justifyContent="center" gap={3}>
            <Heading as="h4" size="md">{"QRCode da mesa"}</Heading>
            <Card 
              w={200}
              h={200}
              display="flex" 
              justifyContent="center" 
              alignItems="center"
              boxShadow="0px 4px 12px rgba(0, 0, 0, 0.2)"
            >
              {qrValue && (
                <Flex>
                  <QRCode value={qrValue} size={160} />
                </Flex>
              )}
            </Card>
          </Flex>
        </Card>
    </Grid>
  );
}
