import { Box } from "@chakra-ui/react";
import { ReactNode } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../../services/auth";

interface PublicRouteProps {
    children: ReactNode;
    title?: string
}

export function PublicRoute() {
    const auth = isAuthenticated(); // determine if authorized, from context or however you're doing it

    // If authorized, return an outlet that will render child elements
    // If not, return element that will navigate to login page
    return !auth ? <Outlet /> : <Navigate to="/" />;
}

export function PublicRouteWrapper({ children }: PublicRouteProps) {
    // const [mod1] = useMediaQuery(["(min-width: 600px)"]);
    return (
        <Box maxW="8xl" p="4" m="auto" display="flex" flex={1} minHeight="100vh" >
            {children}
        </Box>
    );
}