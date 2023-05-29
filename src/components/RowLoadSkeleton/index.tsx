import { SimpleGrid, Skeleton, useMediaQuery } from "@chakra-ui/react";

export const RowLoadSkeleton: React.FC = () => {
  const [isLargerThan1280, isLargerThan700, isLargerThan1600] = useMediaQuery([
    "(min-width: 1280px)",
    "(min-width: 700px)",
    "(min-width: 1600px)",
  ]);
  return (
    <SimpleGrid
      gap={4}
      minChildWidth={800}
      gridTemplateRows={
        isLargerThan700
          ? isLargerThan1280
            ? isLargerThan1600
              ? "1fr 1fr 1fr 1fr 1fr"
              : "1fr 1fr 1fr 1fr"
            : "1fr 1fr"
          : "1fr"
      }
    >
      <Skeleton height="60px" borderRadius="md" />
      <Skeleton height="60px" borderRadius="md" />
      <Skeleton height="60px" borderRadius="md" />
      <Skeleton height="60px" borderRadius="md" />
    </SimpleGrid>
  );
};
