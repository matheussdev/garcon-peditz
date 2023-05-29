import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputProps,
  InputRightElement,
  useDisclosure,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import * as React from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { Link } from "react-router-dom";

interface PasswordFieldProps extends InputProps {
  register?:boolean;
  htmlProps?: HTMLInputElement;
  label?:string;
}

export const PasswordField = ({
  register,
  htmlProps,
  label="Senha",
  ...rest
}: PasswordFieldProps) => {
  const { isOpen, onToggle } = useDisclosure();

  const onClickReveal = () => {
    onToggle();
  };

  return (
    <FormControl id="password">
      <Flex justify="space-between">
        <FormLabel>{label}</FormLabel>
        {
            !register && <Box
            as={Link}
            color={mode("green.600", "green.200")}
            fontWeight="semibold"
            fontSize="sm"
            to={"/recuperar-senha"}
          >
            Esqueceu sua senha?
          </Box>
        }
      </Flex>
      <InputGroup>
        <InputRightElement>
          <IconButton
            bg="transparent !important"
            variant="ghost"
            aria-label={isOpen ? "Mask password" : "Reveal password"}
            icon={isOpen ? <HiEyeOff /> : <HiEye />}
            onClick={onClickReveal}
          />
        </InputRightElement>
        <Input
          name={`password-${label}`}
          type={isOpen ? "text" : "password"}
          autoComplete="current-password"
          required
          {...rest}
        />
      </InputGroup>
    </FormControl>
  );
};
PasswordField.displayName = "PasswordField";
