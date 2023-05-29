import { SimpleGrid } from "@chakra-ui/react";
import { Card } from "../../components/Card";

export function Support(){
    return(
        <SimpleGrid gap={6} minChildWidth={300}>
            <Card maxWidth={400}>
                whatsapp
            </Card>
            <Card maxWidth={400}>
                email
            </Card>
        </SimpleGrid>
    )
}