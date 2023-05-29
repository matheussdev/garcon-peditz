import { Flex, useDisclosure, useMediaQuery } from "@chakra-ui/react";
import React, { ReactNode, useEffect } from "react";

import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { Header } from "../../components/Header";
import { SideBar, MobileSideBar } from "../../components/SideBar";
import { LoginProvider } from "../../hooks/useLogin";
import api from "../../services/api";
import { isAuthenticated } from "../../services/auth";

interface PrivateRouteProps {
  children: ReactNode;
  title?: string;
}

export function PrivateRoute() {
  const auth = isAuthenticated(); // determine if authorized, from context or however you're doing it
  const navigate = useNavigate();
  // If authorized, return an outlet that will render child elements
  // If not, return element that will navigate to login page

  useEffect(() => {
    if (
      window.location.pathname !== "/criar-loja" &&
      !localStorage.getItem("@peditzStore")
    ) {
      api
        .get("/api/company")
        .then((response) => {
          localStorage.setItem("@peditzStore", JSON.stringify(response.data));
        })
        .catch((err) => {
        });
    }
  }, [navigate]);
  return auth ? <Outlet /> : <Navigate to="/login" />;
}

export function PrivateRouteWrapper({ children, title }: PrivateRouteProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [mod1] = useMediaQuery(["(min-width: 600px)"]);
  return (
    <LoginProvider>
      <Flex bg={"green.500"} w={"100vw"} h={"100vh"}>
        {mod1 ? (
          <SideBar />
        ) : (
          <MobileSideBar onClose={onClose} isOpen={isOpen} />
        )}
        <Flex
          flexDirection={"column"}
          flex={1}
          bg="#F2F2F2"
          pb={10}
          borderLeftRadius={mod1 ? "3xl" : "none"}
          pos={"relative"}
          overflowY={mod1 ? "auto" : "visible"}
        >
          <Header title={title} onOpenMobile={onOpen} />
          <Flex
            flexDirection={"column"}
            flex={1}
            px={mod1 ? 12 : 4}
            pb={mod1 ? 0 : 10}
            mt={mod1 ? 0 : 100}
          >
            {children}
          </Flex>
        </Flex>
      </Flex>
    </LoginProvider>
  );
}
