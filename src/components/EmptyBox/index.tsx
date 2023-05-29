import { Box, Heading, Text } from "@chakra-ui/react";
interface EmptyBoxProps{
  title?: string
  description?: string
}
export const EmptyBox: React.FC<EmptyBoxProps> = ({title, description}) => {
  return (
    <Box
      w={"100%"}
      border="3px"
      borderColor="gray.300"
      p={6}
      alignItems="center"
      display="flex"
      borderStyle="dashed"
      flexDir="column"
      borderRadius="xl"
    >
      <Heading as="h5" size="md" color="gray.400" textAlign="center">
        {title}
      </Heading>
      <Text textAlign="center" color="gray.400" mt={2}>
        {description}
      </Text>
    </Box>
  );
};
