import {
  Flex,
  Heading,
  Icon,
  List,
  ListIcon,
  ListItem,
  Text,
  useColorModeValue,
  VStack,
  Box,
  BoxProps,
  FlexProps,
  Button,
  ButtonProps,
} from "@chakra-ui/react";
import * as React from "react";
import { HiCheckCircle } from "react-icons/hi";

export const ActionButton = (props: ButtonProps) => (
  <Button
    colorScheme="green"
    size="lg"
    w="full"
    fontWeight="extrabold"
    py={{ md: "8" }}
    {...props}
  />
);

//cardbadge

export const CardBadge = (props: FlexProps) => {
  const { children, ...flexProps } = props;
  return (
    <Flex
      bg={useColorModeValue("green.500", "green.200")}
      position="absolute"
      right={-20}
      top={6}
      width="240px"
      transform="rotate(45deg)"
      py={2}
      justifyContent="center"
      alignItems="center"
      {...flexProps}
    >
      <Text
        fontSize="xs"
        textTransform="uppercase"
        fontWeight="bold"
        letterSpacing="wider"
        color={useColorModeValue("white", "gray.800")}
      >
        {children}
      </Text>
    </Flex>
  );
};

//card

export interface CardProps extends BoxProps {
  isPopular?: boolean;
}

export const Card = (props: CardProps) => {
  const { children, isPopular, ...rest } = props;
  return (
    <Box
      bg={useColorModeValue("white", "gray.700")}
      position="relative"
      px="4"
      pb="4"
      pt="8"
      overflow="hidden"
      shadow="lg"
      maxW="md"
      width="100%"
      {...rest}
    >
      {isPopular && <CardBadge>Popular</CardBadge>}
      {children}
    </Box>
  );
};

// pricing cards

export interface PricingCardData {
  features: string[];
  name: string;
  price: string;
}

interface PricingCardProps extends CardProps {
  data: PricingCardData;
  icon: React.ElementType;
  button: React.ReactElement;
}

export const PricingCard = (props: PricingCardProps) => {
  const { data, icon, button, ...rest } = props;
  const { features, price, name } = data;
  const accentColor = useColorModeValue("green.600", "green.200");

  return (
    <Card rounded={{ sm: "xl" }} {...rest}>
      <VStack spacing={2}>
        <Icon aria-hidden as={icon} fontSize="2xl" color={accentColor} />
        <Heading size="md" fontWeight="extrabold">
          {name}
        </Heading>
      </VStack>
      <Flex
        align="flex-end"
        justify="center"
        fontWeight="extrabold"
        color={accentColor}
        my={4}
      >
        <Heading size="lg" fontWeight="inherit" lineHeight="0.9em">
          {price}
        </Heading>
        <Text fontWeight="inherit" fontSize="2xl">
          / yr
        </Text>
      </Flex>
      <List spacing="4" mb="8" maxW="28ch">
        {features.map((feature, index) => (
          <ListItem fontWeight="medium" key={index}>
            <ListIcon
              fontSize="md"
              as={HiCheckCircle}
              marginEnd={2}
              color={accentColor}
            />
            {feature}
          </ListItem>
        ))}
      </List>
      {button}
    </Card>
  );
};
