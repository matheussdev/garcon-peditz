import { Flex, SimpleGrid } from "@chakra-ui/react";
import { ActionButton, PricingCard } from "../../components/PricingCard";
import { SiMicrosoft, SiMarketo, SiHive } from "react-icons/si";

export function Plans() {
  return (
    <Flex flex={1} h={"100%"}>
      <SimpleGrid
        columns={{ base: 1, lg: 3 }}
        spacing={{ base: "8", lg: "0" }}
        w="100%"
        h={"100%"}
        m="auto"
        justifyItems="center"
        alignItems="center"
      >
        <PricingCard
          data={{
            price: "$29",
            name: "Application UI",
            features: [
              "All application UI components",
              "Lifetime access",
              "Use on unlimited projects",
              "Free Updates",
            ],
          }}
          icon={SiMicrosoft}
          button={
            <ActionButton variant="outline" borderWidth="2px">
              Buy now
            </ActionButton>
          }
        />
        <PricingCard
          zIndex={1}
          isPopular
          transform={{ lg: "scale(1.05)" }}
          data={{
            price: "$49",
            name: "Bundle",
            features: [
              "All application UI components",
              "Lifetime access",
              "Use on unlimited projects",
              "Use on unlimited projects",
              "Free Updates",
            ],
          }}
          icon={SiHive}
          button={<ActionButton>Buy now</ActionButton>}
        />
        <PricingCard
          data={{
            price: "$29",
            name: "Marketing UI",
            features: [
              "All application UI components",
              "Lifetime access",
              "Use on unlimited projects",
              "Free Updates",
            ],
          }}
          icon={SiMarketo}
          button={
            <ActionButton variant="outline" borderWidth="2px">
              Buy now
            </ActionButton>
          }
        />
      </SimpleGrid>
    </Flex>
  );
}
