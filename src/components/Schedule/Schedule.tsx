import { Box, Flex, SimpleGrid, Tag, TagLabel, TagCloseButton } from "@chakra-ui/react";

export type DayType = {
    day: string[];
};
export type dayObject = {
    [key: string]: string[];
};


const week = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

interface ScheduleProps {
    result: dayObject;
}

export function Schedule({ result }: ScheduleProps) {
    return <>{week.map((day, key) => (
        <Box key={key}>
            {day}:
            <Flex>
                <SimpleGrid columns={2} flex={1} minChildWidth={85} gap={2}>
                    {

                        result ?
                            <>
                                {result[day]?.map((s) => <Tag
                                    size={"smal"}
                                    borderRadius="full"
                                    variant="solid"
                                    colorScheme="green"
                                    px={1}
                                    width={"fit-content"}
                                >
                                    <TagLabel>{s}</TagLabel>
                                    <TagCloseButton />
                                </Tag>)}
                            </>
                            : ""
                    }
                </SimpleGrid>
            </Flex>
        </Box>
    ))}</>
}