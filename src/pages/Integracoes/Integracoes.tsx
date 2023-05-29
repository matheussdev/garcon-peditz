import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  OrderedList,
  Select,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { BiCopy } from "react-icons/bi";
import api from "../../services/api";
import { IntegrationCard } from "../../components/IntegrationCard";
import { IntegrationIfoodProps } from "../../types";
import { HiOutlineViewGridAdd } from "react-icons/hi";
export function Integracoes() {
  const toast = useToast();
  const [modalIfoodOpen, setModalIfoodOpen] = useState(false);
  const [ifoodCode, setIfoodCode] = useState("");
  const [ifoodAuthCode, setIfoodAuthCode] = useState("");
  const [authorizationCodeVerifier, setAuthorizationCodeVerifier] =
    useState("");
  const [loadIfoodButton, setLoadIfoodButton] = useState(false);
  const [loadIfoodAuth, setLoadIfoodAuth] = useState(false);
  const [integrations, setIntegrations] = useState<IntegrationIfoodProps[]>([]);
  const [noIntegrations, setNoIntegrations] = useState<IntegrationIfoodProps[]>(
    []
  );
  const [pOfSale, setPofSale] = useState("");
  const [mId, setMId] = useState("");
  const [mIdInput, setMIdInput] = useState("");
  const [codeURL, setCodeURL] = useState("https://portal.ifood.com.br/apps");
  function getInitialIntegrations() {
    api.get("/api/point-of-sale/integrations").then((response) => {
      setIntegrations(response.data.withIntegrations);
      setNoIntegrations(response.data.noIntegrations);
    });
  }
  useEffect(() => {
    getInitialIntegrations();
  }, []);

  function generateIfoodCode() {
    setLoadIfoodButton(true);
    setPofSale("");
    setMId("");
    setMIdInput("");
    api
      .post("/api/ifood/authentication/user-code")
      .then((response) => {
        setIfoodCode(response.data.userCode);
        setAuthorizationCodeVerifier(response.data.authorizationCodeVerifier);
        setIfoodAuthCode("");
        setModalIfoodOpen(true);
        setCodeURL(response.data.verificationUrlComplete);
      })
      .catch((err) => {
        console.log(err.response.data);
      })
      .finally(() => {
        setLoadIfoodButton(false);
      });
  }
  function sendIfoodAuth() {
    setLoadIfoodAuth(true);
    api
      .post("/api/ifood/authentication/token", {
        authorizationCode: ifoodAuthCode,
        authorizationCodeVerifier,
        grantType: "authorization_code",
        pointOfSaleId: pOfSale,
        merchantId: mId,
      })
      .then((response) => {
        console.log(response.data);
        setModalIfoodOpen(false);
        getInitialIntegrations();
        toast({
          title: "Ifood conectado!",
          description: "",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
      })
      .catch((err) => {
        console.log(err.response.data);
        setModalIfoodOpen(false);
        toast({
          title: "Erro ao conectar com ifood!",
          description: "",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      })
      .finally(() => {
        setLoadIfoodAuth(false);
        setPofSale("");
      });
  }
  function unsecuredCopyToClipboard(text: string) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
    } catch (err) {
      console.error("Unable to copy to clipboard", err);
    }
    document.body.removeChild(textArea);
  }
  async function copyText(t: string) {
    if (window.isSecureContext && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(t);
      } catch (e) {
        console.log(e);
      }
    } else {
      unsecuredCopyToClipboard(t);
    }
  }
  return (
    <>
      <Flex gap={4} justifyContent="start">
        {integrations.map((x) => (
          <IntegrationCard integration={x} />
        ))}
        <Button
          width={250}
          height={"100%"}
          border="5px"
          borderColor="gray.300"
          color="gray.400"
          cursor="pointer"
          alignItems="center"
          justifyContent="center"
          display="flex"
          borderStyle="dashed"
          minHeight={300}
          flexDir="column"
          borderRadius="xl"
          onClick={() => {
            generateIfoodCode();
          }}
          isLoading={loadIfoodButton}
        >
          <HiOutlineViewGridAdd size={50} />
          <Text fontSize="xl" fontWeight="bold">
            Nova integração
          </Text>
        </Button>
      </Flex>
      <Modal isOpen={modalIfoodOpen} onClose={() => setModalIfoodOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Ifood</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl justifyContent="center" alignItems="center">
              <FormLabel htmlFor="pofsale">
                Qual ponto de venda você quer integrar ?
              </FormLabel>
              <Select id="pofsale" onChange={(e) => setPofSale(e.target.value)}>
                <option value="">Selecione</option>
                {noIntegrations.map((x) => (
                  <option value={x.id} key={x.id}>
                    {x.name}
                  </option>
                ))}
              </Select>
            </FormControl>
            {mId && (
              <FormControl mt={4} justifyContent="center" alignItems="center">
                <FormLabel htmlFor="codigo">ID da loja:</FormLabel>
                <Input type="text" id="codigo" mb="2" disabled value={mId} />
              </FormControl>
            )}
            {pOfSale && (
              <>
                {!mId && (
                  <>
                    <Heading size="sm" mt={4} mb={2}>
                      Primeiro vamos identificar sua loja no ifood
                    </Heading>
                    <Text mb={3}>Para isso siga as instruções abaixo</Text>
                    <OrderedList spacing={3}>
                      <ListItem>
                        Acesse a conta do restaurante no{" "}
                        <Button
                          size="sm"
                          variant="link"
                          colorScheme="blue"
                          onClick={() =>
                            window.open(
                              "https://portal.ifood.com.br/profile/restaurant"
                            )
                          }
                        >
                          portal do ifood
                        </Button>
                      </ListItem>
                      <ListItem>
                        Copie e <strong>ID da loja</strong> do seu restaurante.
                      </ListItem>
                      <ListItem>Cole no campo abaixo.</ListItem>
                    </OrderedList>
                    <FormControl
                      mt={4}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <FormLabel htmlFor="codigo">ID da loja:</FormLabel>
                      <Flex gap={2}>
                        <Input
                          type="text"
                          id="codigo"
                          mb="2"
                          onChange={(e) => {
                            setMIdInput(e.target.value);
                          }}
                          value={mIdInput}
                        />
                        <Button
                          isLoading={loadIfoodButton}
                          onClick={() => {
                            setLoadIfoodButton(true)
                            setTimeout(()=>{
                              setLoadIfoodButton(false)
                              setMId(mIdInput);
                            }, 1000)
                          }}
                        >
                          Validar
                        </Button>
                      </Flex>
                    </FormControl>
                  </>
                )}

                {mId && (
                  <>
                  <Heading size="sm" mt={4} mb={2}>
                      Agora iniciaremos a integração
                    </Heading>
                    <Text mb={3}>Informe as credenciais de acesso ao modulo "ifood"</Text>
                    <OrderedList spacing={3}>
                      <ListItem>Copie o código abaixo</ListItem>
                      <InputGroup size="md" my={2}>
                        <Input
                          pr="4.5rem"
                          type="text"
                          readOnly
                          value={ifoodCode}
                        />
                        <InputRightElement width="4.5rem">
                          <Button
                            size="sm"
                            mx="auto"
                            leftIcon={<BiCopy />}
                            colorScheme="blue"
                            variant="ghost"
                            onClick={() => copyText(ifoodCode)}
                          >
                            Copiar
                          </Button>
                        </InputRightElement>
                      </InputGroup>
                      <ListItem>
                        Acesse a conta do restaurante no{" "}
                        <Button
                          size="sm"
                          variant="link"
                          colorScheme="blue"
                          onClick={() => window.open(codeURL)}
                        >
                          portal do ifood
                        </Button>
                      </ListItem>
                      <ListItem>
                        Clique na aba de aplicativos no menu lateral esquerdo
                      </ListItem>
                      <ListItem>
                        Clique no botão ativar aplicativo por código
                      </ListItem>
                      <ListItem>Cole o código que foi gerado acima</ListItem>
                      <ListItem>
                        Autorize a integração e copie o código do ifood
                      </ListItem>
                      <ListItem>
                        Volte para a tela de integração e salve o código do
                        ifood
                      </ListItem>
                    </OrderedList>
                    <FormControl
                      mt={4}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <FormLabel htmlFor="codigo">Código:</FormLabel>
                      <Input
                        type="text"
                        id="codigo"
                        mb="2"
                        value={ifoodAuthCode}
                        onChange={(e) => setIfoodAuthCode(e.target.value)}
                      />
                    </FormControl>
                  </>
                )}
              </>
            )}
          </ModalBody>

          <ModalFooter justifyContent="space-between">
            <Button
              variant="outline"
              colorScheme="red"
              disabled={loadIfoodAuth}
              onClick={() => setModalIfoodOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              isLoading={loadIfoodAuth}
              onClick={sendIfoodAuth}
              colorScheme="blue"
              disabled={!mId}
            >
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
