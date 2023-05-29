import {
  Badge, Box, Button, CloseButton, Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay, Icon,
  IconButton,
  Image, Tooltip, useMediaQuery, VStack
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import icon from "../../assets/icon.png";
import logo from "../../assets/logo-white.png";

import { SlNote } from "react-icons/sl";
import { HiOutlineUsers } from "react-icons/hi";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import { RiShoppingBag3Line } from "react-icons/ri";
import { BiHomeSmile, BiReceipt } from "react-icons/bi";
import { MdStorefront, MdOutlineMenuBook, MdTableChart } from "react-icons/md";
import { FaBoxes, FaCarrot, FaCashRegister, FaConciergeBell } from "react-icons/fa";
import { BsFillTicketPerforatedFill } from "react-icons/bs";

const sideConfig = {
  open: {
    width: "280px",
    rotate: "",
    logo: logo,
    logoW: "180px",
  },
  min: {
    width: "90px",
    rotate: "rotate(180deg)",
    logo: icon,
    logoW: "50px",
  },
};

const SideBarItens = [
  // {
  //   title: "Dashboard",
  //   url: "/",
  //   icon: BiHomeSmile,
  // },
  {
    title: "Comandas",
    url: "/",
    icon: BiReceipt,
  },
  {
    title: "Mesas",
    url: "/mesas",
    icon: MdTableChart,
  },
  // {
  //   title: "Pedidos",
  //   url: "/pedidos",
  //   icon: SlNote,
  // },
  // {
  //   title: "Usuários",
  //   url: "/users",
  //   icon: HiOutlineUsers,
  // },
  // {
  //   title: "Integrações",
  //   url: "/integracoes",
  //   icon: BiSync,
  // },
  // {
  //   title: "Conta",
  //   url: "/conta",
  //   icon: BiUserCircle,
  // },
  // {
  //   title: "Fale com o suporte",
  //   url: "/suporte",
  //   icon: MdOutlineSupport,
  // },
];
export function SideBar() {
  const [sideState, setSideState] = useState<"open" | "min">("open");
  const [mod1] = useMediaQuery(["(max-width: 1300px)"]);
  const [isOpen, setIsOpen] = useState("open");

  useEffect(() => {
    if (mod1) {
      setSideState("min");
    }
  }, [mod1]);

  function handleSideBar() {
    if (sideState === "open") {
      setSideState("min");
    } else if (sideState === "min") {
      setSideState("open");
    }
  }

  return (
    <>
      <Box
        transition={"all ease-in-out 0.5s"}
        width={sideConfig[sideState].width}
        pos={"relative"}
        p={4}
        zIndex={9}
      >
        <Box my={10} minH={"60px"}>
          <Image
            src={sideConfig[sideState].logo}
            transition={"none"}
            mx="auto"
            w={sideConfig[sideState].logoW}
          />
        </Box>
        <VStack color={"white"} fontSize={"1.2rem"} fontWeight={"bold"}>
          <Tooltip
            label={"Pedidos"}
            isDisabled={sideState === "open"}
            placement="right"
          >
            <Button
              to={"/pedidos"}
              leftIcon={<Icon as={FaConciergeBell} h={6} w={6} />}
              as={Link}
              bg={"white"}
              color={"blackAlpha.500"}
              p={4}
              mb={4}
              isActive={
                window.document.location.pathname.split("/")[1] === "pedidos"
              }
              rounded={"md"}
              justifyContent={"flex-start"}
              fontSize={"1.1rem"}
              w={"100%"}
              _active={{
                bg: "rgba(255, 255, 255, 1)",
                color: "blue.300",
              }}
              _hover={{ bg: "rgba(255, 255, 255, 0.8)" }}
              overflow={"hidden"}
              shadow={"md"}
            >
              {sideState === "open" && "Pedidos"}
              <Badge
                variant={"solid"}
                colorScheme="blue"
                pos={sideState === "open" ? "relative" : "absolute"}
                ml={"auto"}
                top={sideState === "open" ? 0 : 1}
                right={1}
                rounded={"full"}
                p={0.5}
              >
                13
              </Badge>
            </Button>
          </Tooltip>
          {SideBarItens.map((item) => (
            <Tooltip
              label={item.title}
              isDisabled={sideState === "open"}
              placement="right"
              key={item.title}
            >
              <Box
                transition={"all ease-in-out 0.5s"}
                width={sideConfig[sideState].width}
                px="4"
              >
                <Button
                  to={item.url}
                  leftIcon={<Icon as={item.icon} h={6} w={6} />}
                  as={Link}
                  colorScheme={"green"}
                  p={4}
                  isActive={
                    window.document.location.pathname.split("/")[1] ===
                    item.url.split("/")[1]
                  }
                  rounded={"md"}
                  justifyContent={"flex-start"}
                  fontSize={"1.1rem"}
                  w={"100%"}
                  _active={{
                    bg: "rgba(0, 0, 0, 0.1)",
                  }}
                  _hover={{ bg: "rgba(0, 0, 0, 0.05)" }}
                  overflow={"hidden"}
                >
                  {sideState === "open" && item.title}
                  <Badge
                    variant={"solid"}
                    colorScheme="blue"
                    pos={"absolute"}
                    top={0}
                    left={2}
                    rounded={"full"}
                  >
                    {/* {item.alert} */}
                  </Badge>
                </Button>
              </Box>
            </Tooltip>
          ))}
        </VStack>
        {/* <Tooltip
          label={"Escolher plano"}
          isDisabled={sideState === "open"}
          placement="right"
        >
          <Button
            to={"/planos"}
            leftIcon={<Icon as={GiQueenCrown} h={6} w={6} />}
            as={Link}
            bg={"white"}
            color={"yellow.400"}
            p={4}
            mt={6}
            isActive={
              window.document.location.pathname.split("/")[1] === "planos"
            }
            rounded={"md"}
            justifyContent={"flex-start"}
            fontSize={"1.1rem"}
            w={"100%"}
            _active={{
              bg: "rgba(255, 255, 255, 1)",
            }}
            _hover={{ bg: "rgba(255, 255, 255, 0.8)" }}
            overflow={"hidden"}
            shadow={"md"}
          >
            {sideState === "open" && "Escolher plano"}
          </Button>
        </Tooltip> */}
        <IconButton
          rounded={"full"}
          bg="white"
          position={"absolute"}
          right={-5}
          top="50%"
          shadow={"md"}
          aria-label="Search database"
          icon={<Icon h={6} w={6} as={ChevronLeftIcon} />}
          transform={sideConfig[sideState].rotate}
          onClick={handleSideBar}
          transition={"all ease-in-out 0.5s"}

          color={"green.500"}
        />
      </Box>
    </>
  );
}

interface MobileSideBarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileSideBar({ isOpen, onClose }: MobileSideBarProps) {
  return (
    <Drawer placement={"left"} onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay />
      <DrawerContent bg={"green.500"}>
        <DrawerBody>
          <CloseButton
            onClick={onClose}
            pos={"absolute"}
            top={4}
            right={4}
            color={"white"}
            size="lg"
          />
          <Box
            transition={"all ease-in-out 0.5s"}
            width={sideConfig["open"].width}
            pos={"relative"}
            p={4}
            zIndex={9}
          >
            <Box my={8} minH={"60px"}>
              <Image
                src={sideConfig["open"].logo}
                transition={"none"}
                mx="auto"
                w={sideConfig["open"].logoW}
              />
            </Box>
            <VStack color={"white"} fontSize={"1.2rem"} fontWeight={"bold"}>
              <Button
                to={"/pedidos"}
                leftIcon={<Icon as={FaConciergeBell} h={6} w={6} />}
                as={Link}
                bg={"white"}
                color={"blackAlpha.500"}
                p={4}
                mb={4}
                isActive={
                  window.document.location.pathname.split("/")[1] === "pedidos"
                }
                rounded={"md"}
                justifyContent={"flex-start"}
                fontSize={"1.1rem"}
                w={"100%"}
                _active={{
                  bg: "rgba(255, 255, 255, 1)",
                  color: "blue.300",
                }}
                _hover={{ bg: "rgba(255, 255, 255, 0.8)" }}
                overflow={"hidden"}
                shadow={"md"}
                onClick={onClose}
              >
                {"Pedidos"}
                <Badge
                  variant={"solid"}
                  colorScheme="blue"
                  pos={"relative"}
                  ml={"auto"}
                  top={0}
                  right={1}
                  rounded={"full"}
                  p={0.5}
                >
                  13
                </Badge>
              </Button>
              {SideBarItens.map((item) => (
                <Button
                  key={item.title}
                  to={item.url}
                  leftIcon={<Icon as={item.icon} h={6} w={6} />}
                  as={Link}
                  colorScheme={"green"}
                  p={4}
                  isActive={
                    window.document.location.pathname.split("/")[1] ===
                    item.url.split("/")[1]
                  }
                  rounded={"md"}
                  justifyContent={"flex-start"}
                  fontSize={"1.1rem"}
                  w={"100%"}
                  _active={{
                    bg: "rgba(0, 0, 0, 0.1)",
                  }}
                  _hover={{ bg: "rgba(0, 0, 0, 0.05)" }}
                  overflow={"hidden"}
                  onClick={onClose}
                >
                  {item.title}
                </Button>
              ))}
            </VStack>
          </Box>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
