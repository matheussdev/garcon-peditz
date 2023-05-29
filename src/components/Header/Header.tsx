import { HamburgerIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Flex,
  Heading,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tag,
  TagLabel,
  useMediaQuery,
} from "@chakra-ui/react";
import { BiUserCircle } from "react-icons/bi";

import { FiLogOut } from "react-icons/fi";
import { HiOutlineUsers } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../../hooks/useLogin";
import { logout } from "../../services/auth";

interface HeaderProps {
  onOpenMobile: () => void;
  title?: string;
}

export function Header({ onOpenMobile, title }: HeaderProps) {
  let navigate = useNavigate();

  const [mod1, mod2] = useMediaQuery([
    "(min-width: 600px)",
    "(max-width: 600px)",
  ]);

  const { user } = useLogin()

  return (
    <Flex
      shadow={mod2 ? "md" : "none"}
      justify={"flex-end"}
      w={"100%"}
      zIndex={10}
      pos={mod2 ? "fixed" : "relative"}
      pt={mod1 ? 10 : 4}
      px={mod1 ? 12 : 4}
      pb={4}
      mb={4}
      alignItems={"center"}
      bg={mod2 ? "White" : "none"}
      borderBottom={mod2 ? "1px solid" : "none"}
      borderBottomColor={"green.500"}
    >
      {mod2 && (
        <IconButton
          aria-label="menu-mobile"
          icon={<HamburgerIcon />}
          variant="outline"
          onClick={onOpenMobile}
          mr={4}
        />
      )}

      <Heading as="h2" size={"md"}>
        {title}
      </Heading>

      <HStack spacing={4} flex={1} justifyContent={"flex-end"}>
        {/* <Button
          variant={"ghost"}
          colorScheme={"blackAlpha"}
          aria-label="Search database"
        >
          <Icon as={BellIcon} h={5} width={5} />
          <Badge
            variant="solid"
            colorScheme="red"
            pos={"absolute"}
            top={0}
            right={0}
          >
            17
          </Badge>
        </Button> */}
        {/* {mod1 && (
          <Button
            variant={"ghost"}
            colorScheme={"blackAlpha"}
            rightIcon={<Icon as={FiExternalLink} />}
          >
            Ver no site
          </Button>
        )} */}

        <Menu isLazy placement="bottom-end">
          <MenuButton>
            <Tag
              cursor={"pointer"}
              size="lg"
              colorScheme="red"
              borderRadius="full"
            >
              <Avatar
                size="xs"
                name={user.name}
                ml={mod1 ? -1 : 0}
                mr={mod1 ? 2 : 0}
              />
              {/* {mod1 && <TagLabel>{user.name.split(" ")[0]}</TagLabel>} */}
              <TagLabel>{user.name.split(" ")[0]}</TagLabel>
            </Tag>
          </MenuButton>
          <MenuList>
            {/* MenuItems are not rendered unless Menu is open */}
            <MenuItem icon={<BiUserCircle />} onClick={()=>navigate("/conta")} >Conta</MenuItem>
            <MenuItem icon={<HiOutlineUsers />} onClick={()=>navigate("/users")} >Usuários</MenuItem>
            <MenuItem icon={<FiLogOut />} onClick={() => logout()}>Sair</MenuItem>
          </MenuList>
        </Menu>
      </HStack>
    </Flex>
  );
}
