import { Box, Heading } from "@chakra-ui/react";
import { Card } from "../Card";

interface ComandaCardProps {
  number: number;
  name: string;
  unit: string | undefined;
}

export const IngredientsCard: React.FC<ComandaCardProps> = ({
  name,
  number,
  unit,
}) => {
  return (
    <Card 
      maxWidth="250px" p={6}
      border="5px"
      borderColor="gray.300"
      borderStyle="dashed"
    >
      <Box
        borderRadius="50%"
        display="flex"
        justifyContent="center"
        alignItems="center"
        width={"110px"}
        boxShadow="lg"
        mx="auto"
        height={"110px"}
        position="relative"
        bg="gray.200"
        color="gray.500"
      >
        <Heading>{number}</Heading>
        {unit}
      </Box>
      <Heading
        textAlign="center"
        mt={4}
        as="h6"
        size="sm"
      >
        {name}
      </Heading>
    </Card>
  );
};
