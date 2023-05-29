import {
  Button,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Select,
} from "@chakra-ui/react";
import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import { setPointOfSale } from "../../utils/setPointOfSale";

import { ComandaCard } from "../../components/ComandaCard";
import { ComandaModal } from "../../components/NewComandaModal";
import { LaunchOrderModal } from "../../components/LaunchOrderModal";
import { PointOfSale } from "../../types";
import { SearchIcon } from "@chakra-ui/icons";
import { ViewCommandModal } from "../../components/ViewCommandModal";

interface ITable {
  id: string;
  name: string;
  number: number;
}



export function Comandas() {
  const navigate = useNavigate();
  const [newComandaOpen, setNewComandaOpen] = useState(false);
  const [launchOrderModalOpen, setLaunchOrderModalOpen] = useState("");
  const [viewCommandModalOpen, setViewCommandModalOpen] = useState("");
  const [points, setPoints] = useState<PointOfSale[]>([]);
  const [pointTofilter, setPointToFilter] = useState("");
  const [commands, setCommands] = useState<any[]>([]);
  const [commandsToShow, setCommandsToShow] = useState<any[]>([]);
  const [searchInput, setSearchInput] = useState("");

  const [tables, setTables] = useState<ITable[]>([]);

  function getCommands(id: string) {
    api
      .get(`/api/commands/point-of-sale/${id}/?active=true`)
      .then((response) => {
        setCommands(response.data);
        setCommandsToShow(response.data);
      });
  }

  async function getTables(id: string) {
    api
      .get(`/api/table/${id}`)
      .then((response) => {
        setTables(response.data)
      });
  }

  useEffect(() => {
    api.get("/api/point-of-sale").then((response) => {
      setPoints(response.data);
      setPointToFilter(response.data[0].id);
      getCommands(response.data[0].id);
      getTables(response.data[0].id);
    });

    
    
  }, []);

  function isNumeric(value: any) {
    return /^-?\d+$/.test(value);
  }

  function search(e: string) {
    let list = commands;
    if (isNumeric(e)) {
      setCommandsToShow(list.filter((x) => x.commandCode.code === Number(e)));
    } else if (e.length > 2) {
      setCommandsToShow(list.filter((x) => x.clientName.includes(e)));
    } else {
      setCommandsToShow(commands);
    }
  }
  return (
    <>
      <Flex gap={4} mb={6} flexWrap="wrap" justifyContent="space-between">
        <Flex gap={4}>
          <Select
            w={"fit-content"}
            background="white"
            value={pointTofilter}
            onChange={(e) => {
              setPointOfSale(e.target.value)
              setPointToFilter(e.target.value);
              // getStock(`?pointOfSaleId=${e.target.value}`);
              getCommands(e.target.value);
            }}
          >
            {/* <option value="">Selecione um ponto de venda</option> */}
            {points.map((x) => (
              <option value={x.id} key={x.id}>
                {x.name}
              </option>
            ))}
          </Select>
          <Button
            onClick={() => {
              setNewComandaOpen(true);
            }}
            colorScheme="green"
          >
            Adicionar Comanda
          </Button>
        </Flex>
        <form
          action=""
          onSubmit={(e: FormEvent) => {
            e.preventDefault();
            search(searchInput);
          }}
        >
          <InputGroup flex={1} maxWidth="510px" size="md" width="345px">
            <Input
              pr="4.5rem"
              type="text"
              placeholder="Nome, Nº da Comanda ou Telefone"
              background="white"
              onChange={(e) => {
                if (e.target.value.length === 0) {
                  setCommandsToShow(commands);
                }
                setSearchInput(e.target.value);
              }}
            />
            <InputRightElement width="4.5rem">
              <Button
                h="1.75rem"
                size="md"
                type="submit"
                disabled={searchInput.length === 0}
              >
                <SearchIcon />
              </Button>
            </InputRightElement>
          </InputGroup>
        </form>
      </Flex>
      <Flex gap={3} justifyContent="start" flexWrap="wrap">
        {commandsToShow.map((x, k) => (
          <ComandaCard
            key={x.id}
            name={x.clientName}
            number={String(x.commandCode?.code ? x.commandCode?.code : "")}
            // onNewOrderClick={() => setLaunchOrderModalOpen(x.id)}
            onViewClick={() => navigate(`/comandas/${x.id}`)}
          />
        ))}
      </Flex>
      <ComandaModal
        onSave={() => {
          setNewComandaOpen(false);
          getCommands(pointTofilter);
        }}
        posId={pointTofilter}
        onCloseModal={() => {
          setNewComandaOpen(false);
        }}
        open={newComandaOpen}
        tables={tables}
      />
      <LaunchOrderModal
        onSave={() => {
          setLaunchOrderModalOpen("");
        }}
        posId={pointTofilter}
        onCloseModal={() => {
          setLaunchOrderModalOpen("");
        }}
        open={launchOrderModalOpen}
      />
    </>
  );
}
