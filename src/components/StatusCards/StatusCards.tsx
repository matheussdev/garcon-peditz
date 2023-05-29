import { useEffect, useState } from "react";

import { AiOutlineEye } from "react-icons/ai";
import { BsBagFill } from "react-icons/bs";
import { FaUserCheck } from "react-icons/fa";
import { IoStorefrontOutline } from "react-icons/io5";

import api from "../../services/api";
import { PointOfSale } from "../../types";

import {
  Box,
  Switch,
  Text,
  Grid,
  Flex,
  Icon,
  Select,
  Button,
} from "@chakra-ui/react";

const cards = [
  {
    icon: AiOutlineEye,
    title: "Visitas hoje",
    value: 206,
    bg: "#ffe893",
  },
  {
    icon: BsBagFill,
    title: "Pedidos de hoje",
    value: 123,
    bg: "#84FA84",
  },
  {
    icon: FaUserCheck,
    title: "Novos Clientes hoje",
    value: 132869,
  },
];

type point = string | null;
type status = boolean | null | string;

export function StatusCards() {
  const [points, setPoints] = useState<PointOfSale[]>([]);
  const [pointTofilter, setPointToFilter] = useState<point>("");
  const [pointStatus, setPointStatus] = useState<status>(false);

  function openOrClosePoint(status: boolean) {
    api.get(`/api/point-of-sale/`).then((response) => {
      const res = response.data.filter((point: any) => {
        return point.id === pointTofilter;
      });
      // console.log(res[0].active);
      // console.log(status);
      if (res[0].active !== status) {
        console.log("vai mudar o status");
        // api
        //   .patch(`/api/point-of-sale/status/${pointTofilter}`)
        //   .then((response) => {
        //     console.log(response.data);
        //   });
      }
    });
  }

  useEffect(() => {

    const status = Boolean(localStorage.getItem("@pointStatus"))

    setPointToFilter(localStorage.getItem("@pointOfSale"));
    setPointStatus(status);

    console.log(pointStatus);

    api.get("/api/point-of-sale").then((response) => {
      setPoints(response.data);
      // setPointToFilter(response.data[0].id);
      // setPointStatus(response.data[0].active);
      // localStorage.setItem('@pointOfSale',response.data[0].id)
      // localStorage.setItem('@pointStatus',response.data[0].active)

      // getCommands(response.data[0].id);
      // getTables(response.data[0].id);

    });
  }, []);

  useEffect(() => {

    console.log("status do ponto: ", pointStatus);
  }, [pointStatus]);

  return (
    <Grid padding={"50px"} pt={"10px"} pl={"20px"} pr={"20px"}>
      <Flex gap={4} mb={5} ml={10}>
        <Select
          w={"fit-content"}
          background="white"
          // value={pointTofilter}
          onChange={(e) => {
            setPointToFilter(e.target.value);
          }}
        >
          {/* <option value="">Selecione um ponto de venda</option> */}
          {points.map((x) => (
            <option value={x.id} key={x.id}>
              {x.name}
            </option>
          ))}
        </Select>
      </Flex>
      <Flex justify={"space-evenly"}>
        <Box
          w={"20%"}
          minW={"250px"}
          boxShadow="md"
          h={"80px"}
          bg={"white"}
          borderRadius={"10px"}
          padding={"12px"}
          display={"flex"}
          justifyContent={"space-between"}
          flexDirection={"column"}
        >
          <Flex justifyContent={"space-between"} alignItems={"center"}>
            <Box display={"flex"} gap={2}>
              <Box
                w={"25px"}
                h={"25px"}
                bg={"#ffe893"}
                color={"white"}
                display={"flex"}
                alignContent={"center"}
                justifyContent={"center"}
                borderRadius={"10%"}
              >
                <Icon
                  color={"white"}
                  as={AiOutlineEye}
                  alignSelf={"center"}
                  w={"100%"}
                  h={"100%"}
                />
              </Box>
              <Text color={"#C4C4BA"}>Visitas hoje</Text>
            </Box>
            <Text fontWeight={"bold"} color={"green.500"} fontSize={13}>
              {"+ 2,9 %"}
            </Text>
          </Flex>
          <Text fontSize={25} fontWeight={"bold"} mb={"-8px"} color={"#E99711"}>
            {206}
          </Text>
        </Box>

        <Box
          w={"20%"}
          minW={"250px"}
          boxShadow="md"
          h={"80px"}
          bg={"white"}
          borderRadius={"10px"}
          padding={"12px"}
          display={"flex"}
          justifyContent={"space-between"}
          flexDirection={"column"}
        >
          <Flex justifyContent={"space-between"} alignItems={"center"}>
            <Box display={"flex"} gap={2}>
              <Box
                w={"25px"}
                h={"25px"}
                bg={"#9bfd9b"}
                color={"white"}
                display={"flex"}
                alignContent={"center"}
                justifyContent={"center"}
                borderRadius={"10%"}
              >
                <Icon
                  color={"green.500"}
                  as={BsBagFill}
                  alignSelf={"center"}
                  w={"70%"}
                  h={"70%"}
                />
              </Box>
              <Text color={"#C4C4BA"}>Clientes Hoje</Text>
            </Box>
            <Text fontWeight={"bold"} color={"green.500"} fontSize={13}>
              {"+ 3,4 %"}
            </Text>
          </Flex>
          <Text
            fontSize={25}
            fontWeight={"bold"}
            mb={"-8px"}
            color={"green.500"}
          >
            {123}
          </Text>
        </Box>

        <Box
          w={"20%"}
          minW={"250px"}
          boxShadow="md"
          h={"80px"}
          bg={"white"}
          borderRadius={"10px"}
          padding={"12px"}
          display={"flex"}
          justifyContent={"space-between"}
          flexDirection={"column"}
        >
          <Flex justifyContent={"space-between"} alignItems={"center"}>
            <Box display={"flex"} gap={2}>
              <Box
                w={"25px"}
                h={"25px"}
                bg={"#d69bfd"}
                color={"white"}
                display={"flex"}
                alignContent={"center"}
                justifyContent={"center"}
                borderRadius={"10%"}
              >
                <Icon
                  color={"white"}
                  as={FaUserCheck}
                  alignSelf={"center"}
                  w={"80%"}
                  h={"80%"}
                />
              </Box>
              <Text color={"#C4C4BA"}>Novos Clientes Hoje</Text>
            </Box>
            {/* <Text fontWeight={"bold"} color={"green.500"} fontSize={13}>{"+ 3,4 %"}</Text> */}
          </Flex>
          <Text fontSize={25} fontWeight={"bold"} mb={"-8px"} color={"#9612ee"}>
            {159678}
          </Text>
        </Box>

        <Box
          w={"20%"}
          minW={"250px"}
          boxShadow="md"
          h={"80px"}
          bg={"white"}
          borderRadius={"10px"}
          padding={"12px"}
          display={"flex"}
          justifyContent={"space-between"}
          flexDirection={"column"}
        >
          <Flex justifyContent={"space-between"} alignItems={"center"}>
            <Box display={"flex"} gap={2}>
              <Box
                w={"25px"}
                h={"25px"}
                bg={"#189c1dab"}
                color={"white"}
                display={"flex"}
                alignContent={"center"}
                justifyContent={"center"}
                borderRadius={"10%"}
              >
                <Icon
                  color={"white"}
                  as={IoStorefrontOutline}
                  alignSelf={"center"}
                  w={"80%"}
                  h={"80%"}
                />
              </Box>
              <Text color={"#C4C4BA"}>Status da Loja</Text>
            </Box>
            {/* <Text fontWeight={"bold"} color={"green.500"} fontSize={13}>{"+ 3,4 %"}</Text> */}
            <Switch
              size="sm"
              colorScheme="green"
              onChange={(e) => {
                openOrClosePoint(e.target.checked);
              }}
            />
            {/* <Switch colorScheme='red' /> */}
          </Flex>
          <Box
            backgroundColor={"green.500"}
            w={"80px"}
            h={"22px"}
            borderRadius={"5px"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <Text color={"white"} fontSize={"14px"} fontWeight={"bold"}>
              {!pointStatus ? "Fechado" : "Aberto"}
            </Text>
          </Box>
        </Box>
      </Flex>
    </Grid>
  );
}
