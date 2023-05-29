import React, { useState } from "react";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Select as CkSelect,
  SimpleGrid,
  Tooltip,
} from "@chakra-ui/react";
import {
  AditionalProps,
  FormulaAdditional,
  TypesAdditional,
} from "../../types";
import { DeleteIcon, QuestionOutlineIcon } from "@chakra-ui/icons";
import { currencyConfig } from "../../utils/currency";
import IntlCurrencyInput from "react-intl-currency-input";
import api from "../../services/api";
import { ConfirmModal } from "../ConfirmModal";

interface AdditionaisFormProps {
  aditionais: AditionalProps[];
  onChangeAditionais: (param: AditionalProps[]) => void;
  formulas: FormulaAdditional[];
  additionaisType: TypesAdditional[];
}
export const AdditionaisForm: React.FC<AdditionaisFormProps> = ({
  aditionais,
  onChangeAditionais,
  formulas,
  additionaisType,
}) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isOpenDelete, setIsOpenDelete] = useState("");
  const [isOpenDeleteItem, setIsOpenDeleteItem] = useState("");

  function removeAdditional(id: number, idC: string | undefined) {
    let arr = [...aditionais];
    if (idC) {
      api.delete(`/api/products/additionals/${idC}`).then(() => {
        setIsOpenDeleteItem("");
        arr.splice(id, 1);
        onChangeAditionais(arr);
      });
    } else {
      arr.splice(id, 1);
      onChangeAditionais(arr);
    }
  }

  function removeItemAdditional(
    id: number,
    addtId: number,
    idC: string | undefined
  ) {
    let adtnl = [...aditionais];
    let arr = [...adtnl[addtId].complementItems];
    if (idC) {
      api.delete(`/api/complement-item/${idC}`).then(() => {
        setIsOpenDelete("");
        arr.splice(id, 1);
        adtnl[addtId].complementItems = arr;
        onChangeAditionais(adtnl);
      });
    } else {
      arr.splice(id, 1);
      adtnl[addtId].complementItems = arr;
      onChangeAditionais(adtnl);
    }
  }

  function sendRemoveAdditional(x: any) {
    removeAdditional(selectedId!, x.id);
    setIsOpenDelete("");
    setSelectedId(null);
  }

  function sendRemoveItemAdditional(k: any) {
    removeItemAdditional(
      selectedId!,
      k,
      aditionais[k].complementItems[selectedId!].id
    );
    setIsOpenDeleteItem("");
    setSelectedId(null);
  }
  
  function addItemAdditional(id: number) {
    let newArr = [...aditionais];
    newArr[id].complementItems = [...newArr[id].complementItems,
      {
        title: "",
        price: 0,
        minimumAmount: 0,
        maximumAmount: 0,
        order: 0,
      },
    ];
    onChangeAditionais(newArr);
  }
  
  return (
    <>
      {aditionais.map((x, k) => (
        <Flex mb={4} flexDirection="column" key={k}>
          <Flex
            flexDirection="column"
            bg="gray.100"
            border="1px solid"
            borderColor="gray.400"
            borderRadius="1rem 1rem 0 0"
            p="4"
            w="100%"
          >
            <Flex
              flexDirection="row"
              alignItems="center"
              gap="4"
              justifyContent="space-between"
            >
              <Input
                w="70%"
                type="text"
                placeholder="Título"
                bg="white"
                value={x.title}
                onChange={(e) => {
                  let newArr = aditionais;
                  newArr[k].title = e.target.value;
                  onChangeAditionais([...newArr]);
                }}
              />
              {/* <FormControl
                id="selectFunction"
                display="flex"
                alignItems="center"
              >
                <CkSelect bg="white" name="additionalFormula" required>
                  <option value="">Copiar de outro produto</option>
                  <option value="">Escolha seu arroz - Picanha</option>
                  <option value="">Escolha seu arroz - Filé</option>
                  <option value="">Escolha seu arroz - Frango</option>
                  {formulas.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.formula}
                    </option>
                  ))}
                </CkSelect>
                <FormLabel>
                  <Tooltip
                    hasArrow
                    label="Selecione um grupo de adicionais que você queira copiar e clique em copiar"
                    placement="top"
                  >
                    <QuestionOutlineIcon ml={2} />
                  </Tooltip>
                </FormLabel>
                <Button size="sm" variant="solid" colorScheme="orange" px="8">
                  Copiar
                </Button>
              </FormControl> */}
              <IconButton
                aria-label="del-variant"
                colorScheme="red"
                variant="ghost"
                size="md"
                onClick={() => {
                  setSelectedId(k);
                  setIsOpenDelete("delete");
                }}
                icon={<DeleteIcon />}
              />
            </Flex>
            <SimpleGrid minChildWidth={150} gap={4} mt={4}>
              <FormControl id="nome">
                <FormLabel htmlFor="addtMin">Quantidade mínima:</FormLabel>
                <HStack>
                  <Button
                    bg="white"
                    onClick={() => {
                      let newArr = aditionais;
                      newArr[k].minimumAmount =
                        aditionais[k].minimumAmount > 0
                          ? aditionais[k].minimumAmount - 1
                          : 0;
                      onChangeAditionais([...newArr]);
                    }}
                  >
                    -
                  </Button>
                  <Input
                    id="addtMin"
                    bg="white"
                    value={x.minimumAmount}
                    onChange={(e) => {
                      let newArr = aditionais;
                      newArr[k].minimumAmount = Number(e.target.value);
                      onChangeAditionais([...newArr]);
                    }}
                    type="number"
                  />
                  <Button
                    bg="white"
                    onClick={() => {
                      let newArr = aditionais;
                      newArr[k].minimumAmount = aditionais[k].minimumAmount + 1;
                      onChangeAditionais([...newArr]);
                    }}
                  >
                    +
                  </Button>
                </HStack>
              </FormControl>
              <FormControl id="nome">
                <FormLabel htmlFor="addtMax">Quantidade máxima:</FormLabel>
                <HStack>
                  <Button
                    bg="white"
                    onClick={() => {
                      let newArr = aditionais;
                      newArr[k].maximumAmount =
                        aditionais[k].maximumAmount > 0
                          ? aditionais[k].maximumAmount - 1
                          : 0;
                      onChangeAditionais([...newArr]);
                    }}
                  >
                    -
                  </Button>
                  <Input
                    id="addtMax"
                    bg="white"
                    type="number"
                    value={x.maximumAmount}
                    onChange={(e) => {
                      let newArr = aditionais;
                      newArr[k].maximumAmount = Number(e.target.value);
                      onChangeAditionais([...newArr]);
                    }}
                  />
                  <Button
                    bg="white"
                    onClick={() => {
                      let newArr = aditionais;
                      newArr[k].maximumAmount = aditionais[k].maximumAmount + 1;
                      onChangeAditionais([...newArr]);
                    }}
                  >
                    +
                  </Button>
                </HStack>
              </FormControl>
              <FormControl id="selectTipo">
                <FormLabel>
                  Tipo
                  <Tooltip
                    hasArrow
                    label="Modelo de input do adicional"
                    placement="top"
                  >
                    <QuestionOutlineIcon ml={2} />
                  </Tooltip>
                </FormLabel>
                <CkSelect
                  bg="white"
                  name="additionalType"
                  value={x.complementType}
                  onChange={(e) => {
                    let newArr = aditionais;
                    newArr[k].complementType = e.target.value;
                    onChangeAditionais([...newArr]);
                  }}
                  required
                >
                  <option value="">---</option>
                  {additionaisType.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.type}
                    </option>
                  ))}
                </CkSelect>
              </FormControl>
              <FormControl id="selectFunction">
                <FormLabel>
                  Função
                  <Tooltip
                    hasArrow
                    label="Como será calculado este adicional?"
                    placement="top"
                  >
                    <QuestionOutlineIcon ml={2} />
                  </Tooltip>
                </FormLabel>
                <CkSelect
                  bg="white"
                  name="additionalFormula"
                  value={x.complementFormula}
                  onChange={(e) => {
                    let newArr = aditionais;
                    // newArr[k].additionalFormula.title = e.target.value;
                    newArr[k].complementFormula = e.target.value;
                    onChangeAditionais([...newArr]);
                  }}
                  required
                >
                  <option value="">---</option>
                  {formulas.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.formula}
                    </option>
                  ))}
                </CkSelect>
              </FormControl>
            </SimpleGrid>
          </Flex>
          {x.complementItems.map((i, key) => (
            <Flex
              key={i.id}
              flexDirection="column"
              border="1px solid"
              borderColor="gray.400"
              pos="relative"
              borderTop={0}
              p="1rem  1rem 2rem 1rem"
            >
              <SimpleGrid minChildWidth={150} gap={4} mt={4}>
                <Input
                  placeholder="Nome"
                  value={i.title}
                  onChange={(e) => {
                    let newArr = aditionais;
                    newArr[k].complementItems[key].title = e.target.value;
                    onChangeAditionais([...newArr]);
                  }}
                />
                <IntlCurrencyInput
                  currency="BRL"
                  config={currencyConfig}
                  className="phoneInput"
                  value={Number(aditionais[k].complementItems[key].price)}
                  onChange={(
                    event: any,
                    value: number,
                    maskedValued: string
                  ) => {
                    let newArr = aditionais;
                    newArr[k].complementItems[key].price = Number(value);
                    onChangeAditionais([...newArr]);
                  }}
                />
                <FormControl id="addtMin" display="flex" alignItems="center">
                  <FormLabel
                    htmlFor="addtMin"
                    wordBreak="keep-all"
                    flexWrap="nowrap"
                  >
                    min:
                  </FormLabel>
                  <HStack>
                    <Button
                      onClick={() => {
                        let newArr = aditionais;
                        newArr[k].complementItems[key].minimumAmount =
                          newArr[k].complementItems[key].minimumAmount > 0
                            ? newArr[k].complementItems[key].minimumAmount - 1
                            : 0;
                        onChangeAditionais([...newArr]);
                      }}
                    >
                      -
                    </Button>
                    <Input
                      id="addtMin"
                      bg="white"
                      value={aditionais[k].complementItems[key].minimumAmount}
                      onChange={(e) => {
                        let newArr = aditionais;
                        newArr[k].complementItems[key].minimumAmount = Number(
                          e.target.value
                        );
                        onChangeAditionais([...newArr]);
                      }}
                      type="number"
                    />
                    <Button
                      onClick={() => {
                        let newArr = aditionais;
                        newArr[k].complementItems[key].minimumAmount =
                          newArr[k].complementItems[key].minimumAmount + 1;
                        onChangeAditionais([...newArr]);
                      }}
                    >
                      +
                    </Button>
                  </HStack>
                </FormControl>
                <FormControl id="addtMax" display="flex" alignItems="center">
                  <FormLabel htmlFor="addtMax">máx:</FormLabel>
                  <HStack>
                    <Button
                      onClick={() => {
                        let newArr = aditionais;
                        newArr[k].complementItems[key].maximumAmount =
                          newArr[k].complementItems[key].maximumAmount > 0
                            ? newArr[k].complementItems[key].maximumAmount - 1
                            : 0;
                        onChangeAditionais([...newArr]);
                      }}
                    >
                      -
                    </Button>
                    <Input
                      id="addtMax"
                      bg="white"
                      type="number"
                      value={aditionais[k].complementItems[key].maximumAmount}
                      onChange={(e) => {
                        let newArr = aditionais;
                        newArr[k].complementItems[key].maximumAmount = Number(
                          e.target.value
                        );
                        onChangeAditionais([...newArr]);
                      }}
                    />
                    <Button
                      onClick={() => {
                        let newArr = aditionais;
                        newArr[k].complementItems[key].maximumAmount =
                          newArr[k].complementItems[key].maximumAmount + 1;
                        onChangeAditionais([...newArr]);
                      }}
                    >
                      +
                    </Button>
                  </HStack>
                </FormControl>
              </SimpleGrid>
              <IconButton
                pos="absolute"
                right={0}
                top="0"
                aria-label="del-variant"
                colorScheme="red"
                variant="ghost"
                size="md"
                onClick={() => {
                  setSelectedId(key);
                  setIsOpenDeleteItem("delete");
                }}
                icon={<DeleteIcon />}
              />
            </Flex>
          ))}
          <Flex
            flexDirection="column"
            border="1px solid"
            borderColor="gray.400"
            borderRadius="0 0 1rem 1rem"
            pos="relative"
            borderTop={0}
            alignItems="center"
            justifyContent="center"
          >
            <Button
              variant="ghost"
              borderRadius="0 0 1rem 1rem"
              isFullWidth
              colorScheme="whatsapp"
              onClick={() => addItemAdditional(k)}
            >
              Adicionar item
            </Button>
          </Flex>
          <ConfirmModal
            isOpen={isOpenDelete === "delete"}
            onClose={() => setIsOpenDelete("")}
            onCancel={() => setIsOpenDelete("")}
            onConfirm={() => sendRemoveAdditional(selectedId)}
            title="Apagar complemento"
            body={
              <>
                Você tem certeza que deseja apagar este complemento?
                <br />
                Esta ação não pode ser desfeita!
              </>
          }
          />
          <ConfirmModal
            isOpen={isOpenDeleteItem === "delete"}
            onClose={() => setIsOpenDeleteItem("")}
            onCancel={() => setIsOpenDeleteItem("")}
            onConfirm={() => sendRemoveItemAdditional(selectedId)}
            title="Apagar item do complemento"
            body={
              <>
                Você tem certeza que deseja apagar este item do complemento?
                <br />
                Esta ação não pode ser desfeita!
              </>
          }
          />
        </Flex>
      ))}
    </>
  );
};
