import { ExternalLinkIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  Heading,
  Flex,
  FormLabel,
  Tooltip,
  IconButton,
  Switch,
  Text,
  Image,
  useToast
} from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";
import { useLogin } from "../../hooks/useLogin";
import api from "../../services/api";
import { PointOfSale } from "../../types";
import { Card } from "../Card";
interface PointOfSaleCardProps {
  point: PointOfSale;
  onDeleteClick: (id: string) => void;
}

export const PointOfSaleCard: React.FC<PointOfSaleCardProps> = ({
  point,
  onDeleteClick,
}) => {
  const { company } = useLogin();
  const toast = useToast();
  function openPointOfSale(status: boolean) {
    const data = new FormData();
    data.append(
      "pointOfSale",
      JSON.stringify({
        openPointOfSale: status ,
        pointOfSaleId: point.id,
      })
    );
    api
      .patch(`api/point-of-sale/`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
          type: "formData",
        },
      })
      .then(() => {
        toast({
          title: "Ponto de venda! " + (status ? "Aberto!" : "Fechado!"),
          description: "",
          status: "info",
          duration: 4000,
          isClosable: true,
        });
      });
  }
  return (
    <Card>
      <Box
        borderRadius="50%"
        display="flex"
        justifyContent="center"
        alignItems="center"
        overflow="hidden"
        width={120}
        boxShadow="lg"
        mx="auto"
        height={120}
      >
        <Image src={point.image?.link || ""} height="100%" width="1000px" />
      </Box>
      <Heading textAlign="center" mt={4} as="h6" size="md">
        {point.name}
      </Heading>
      <Text textAlign="center">{point.category}</Text>
      <Flex alignItems="center" justifyContent="center" mt="2">
        <FormLabel htmlFor="active">aberto:</FormLabel>
        <Switch
          id="active"
          defaultChecked={point.openPointOfSale}
          checked={point.openPointOfSale}
          onChange={(val) => openPointOfSale(val.target.checked)}
        />
      </Flex>
      <Flex justifyContent="center" gap={2}>
        <Tooltip
          label={`www.catalog-peditz-front.vercel.app/${company?.slug}/${point.slug}/cardapios`}
          placement="bottom"
        >
          <IconButton
            mt={2}
            aria-label="excluir"
            icon={<ExternalLinkIcon />}
            colorScheme="blue"
            borderRadius="full"
            variant="solid"
            onClick={() =>
              window.open(`https://catalog-peditz-front.vercel.app/${company?.slug}/${point.slug}/cardapios`)
            }
          ></IconButton>
        </Tooltip>
        <Tooltip label={"Editar"} placement="bottom">
          <Link to={`/pontos-de-vendas/${point.id}`}>
            <IconButton
              mt={2}
              aria-label="editar"
              icon={<EditIcon />}
              colorScheme="green"
              borderRadius="full"
              variant="solid"
            ></IconButton>
          </Link>
        </Tooltip>
        <Tooltip label={"Excluir"} placement="bottom">
          <IconButton
            mt={2}
            aria-label="excluir"
            icon={<DeleteIcon />}
            colorScheme="red"
            borderRadius="full"
            variant="solid"
            onClick={() => onDeleteClick(point.id)}
          ></IconButton>
        </Tooltip>
      </Flex>
    </Card>
  );
};
