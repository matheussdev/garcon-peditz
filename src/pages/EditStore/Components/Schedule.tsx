import { Alert, AlertIcon, Box, Button, Divider, Flex, useToast,FormControl, FormLabel, Heading, Icon, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, SimpleGrid, Tag, TagCloseButton, TagLabel, useMediaQuery } from "@chakra-ui/react"
import { FormEvent, useEffect, useState } from "react";
import { Card } from "../../../components/Card"
import api from "../../../services/api";
import { BiSave, BiPlus } from "react-icons/bi";

type dayType = "monday" |
    "tuesday" |
    "wednesday" |
    "thursday" |
    "friday" |
    "saturday" |
    "sunday"

type weekType = {
    pt: string; en: "monday" |
    "tuesday" |
    "wednesday" |
    "thursday" |
    "friday" |
    "saturday" |
    "sunday"
}[]

const week: weekType = [{ pt: "Segunda-feira", en: "monday" }, { pt: "Terça-feira", en: "tuesday" },
{ pt: "Quarta-feira", en: "wednesday" }, { pt: "Quinta-feira", en: "thursday" }, { pt: "Sexta-feira", en: "friday" }, { pt: "Sábado", en: "saturday" }, { pt: "Domingo", en: "sunday" }];

interface scheduleProps {
    "monday": string[];
    "tuesday": string[];
    "wednesday": string[];
    "thursday": string[];
    "friday": string[];
    "saturday": string[];
    "sunday": string[];
}


interface ScheduleProps {
    schedule?: scheduleProps;
    pId?: string;
}



export function Schedule({ schedule, pId }: ScheduleProps) {
    const [isOpenSchedule, setIsOpenSchedule] = useState<boolean>(false);
    const toast = useToast()
    const [dayScheduleSelect, setDayScheduleSelect] = useState<dayType>("monday");
    const [openClock, setOpenClock] = useState<string>('');
    const [closeClock, setCloseClock] = useState<string>('');
    const [count, setCount] = useState<number>(0);
    const [addScheduleError, setAddScheduleError] = useState<boolean>(false);

    const [result, setResult] = useState<scheduleProps>({
        "monday": [],
        "tuesday": [
        ],
        "wednesday": [
        ],
        "thursday": [
        ],
        "friday": [
        ],
        "saturday": [
        ],
        "sunday": [
        ]
    })

    useEffect(() => {
        if (schedule) {
            setResult(schedule)
        }
    }, [schedule])


    const [isLargerThan600] = useMediaQuery([
        "(min-width: 1000px)",
        "(max-width: 600px)",
    ]);
    function addSchedule(event: FormEvent) {
        event.preventDefault();
        let newResult: scheduleProps = result;

        if (newResult[dayScheduleSelect].length < 3) {
            newResult[dayScheduleSelect].push(`${openClock}-${closeClock}`)
            setTimeout(() => {
                setResult(newResult);
                setCount(count + 1);
                setIsOpenSchedule(false);
                setAddScheduleError(false);
            }, 100)
        } else {
            setAddScheduleError(true);
        }
    }
    function removeSchedule(key: number, day: dayType) {
        let newResult: scheduleProps = result;

        newResult[day].splice(key, 1)
        setResult(newResult);
        setCount(count + 1);
    }

    useEffect(() => {

    }, [count])

    function sendSchedule(e: FormEvent) {
        e.preventDefault()
        api.patch("api/point-of-sale/schedules", {...result,pointOfSaleId: pId}).then(() => {
            toast({
                title: 'Agenda editada com sucesso!',
                status: 'success',
                duration: 4000,
                isClosable: true,
            })
        }).catch((err) => {
            toast({
                title: 'Error!',
                description: "Houve um error ao tentar editar sua agenda!",
                status: 'error',
                duration: 4000,
                isClosable: true,
            })
            console.log(err)
        }).finally(() => { })
    }

    return <Card>
        <Divider mt={8} mb={4} />
        <Heading
            as="h6"
            size={"md"}
            mb={4}
            display={"flex"}
            justifyContent={isLargerThan600 ? "start" : "space-between"}
            flexDirection={isLargerThan600 ? "column" : "row"}
        >
            Horário de funcionamento
            <Button
                size={"sm"}
                leftIcon={<Icon as={BiPlus} w={4} h={4} />}
                colorScheme="blue"
                variant="solid"
                onClick={() => setIsOpenSchedule(true)}
            >
                Adicionar horário
            </Button>
        </Heading>
        <SimpleGrid columns={2} minChildWidth={isLargerThan600 ? 100 : 400} gap={4}>
            <>{week.map((day, key) => (
                <Box key={key}>
                    {day.pt}:
                    <Flex>
                        <SimpleGrid columns={2} flex={1} minChildWidth={85} gap={2}>
                            {
                                result[day.en].length === 0 && <Tag
                                    size={"smal"}
                                    borderRadius="full"
                                    variant="solid"
                                    colorScheme="red"
                                    px={2}
                                    width={"fit-content"}
                                >Fechado</Tag>
                            }
                            {

                                result ?
                                    <>
                                        {result[day.en]?.map((s, key) => <Tag
                                            key={`${s}-${key}-${day.en}`}
                                            size={"smal"}
                                            borderRadius="full"
                                            variant="solid"
                                            colorScheme="green"
                                            px={1}
                                            width={"fit-content"}
                                        >
                                            <TagLabel>{s}</TagLabel>
                                            <TagCloseButton onClick={() => { removeSchedule(key, day.en) }} />
                                        </Tag>)}
                                    </>
                                    : ""
                            }
                        </SimpleGrid>
                    </Flex>
                </Box>
            ))}</>
        </SimpleGrid>
        <Modal
            isOpen={isOpenSchedule}
            onClose={() => setIsOpenSchedule(false)}
        >
            <ModalOverlay />
            <ModalContent>
                <form onSubmit={addSchedule}>
                    <ModalHeader>Adicionar horário</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        {
                            addScheduleError &&
                            <Alert status="error" mb="4">
                                <AlertIcon />
                                Você só pode adicionar 3 horários de funcionamento em um dia!
                            </Alert>
                        }

                        <FormControl>
                            <FormLabel>Dia da semana:</FormLabel>
                            <Select required onChange={(event) => setDayScheduleSelect(event?.target.value as dayType)}>
                                <option value="monday" >Segunda-feira</option>
                                <option value="tuesday" >terça-feira</option>
                                <option value="wednesday" >Quarta-feira</option>
                                <option value="thursday" >Quinta-feira</option>
                                <option value="friday" >Sexta-feira</option>
                                <option value="saturday" >Sábado</option>
                                <option value="sunday" >Domingo</option>
                            </Select>
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Horário de abertura:</FormLabel>
                            <Input onChange={(event) => setOpenClock(event?.target.value)} required type={"time"} placeholder='00:00' />
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel>Horário de fechamento:</FormLabel>
                            <Input onChange={(event) => setCloseClock(event?.target.value)} required type={"time"} placeholder='00:00' />
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button onClick={() => setIsOpenSchedule(false)} mr={"auto"}>Cancelar</Button>
                        <Button colorScheme='blue' type="submit">
                            Adicionar
                        </Button>
                    </ModalFooter>
                </form>

            </ModalContent>
        </Modal>

        <Flex mt={6}>
                <Button type="button" onClick={sendSchedule} ml="auto" colorScheme={"green"} paddingX={"8"}><Icon mr="2" as={BiSave} /> Salvar</Button>
         </Flex>
    </Card>
}