import { Flex, HStack, Tooltip, IconButton, Badge, Heading, Icon, Text, Image, Box } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { BiEdit, BiTrash, BiLineChart } from "react-icons/bi";
import { FaStar, FaStarHalfAlt, FaConciergeBell, FaBoxes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { currency } from "../../utils/currency";
import { Card } from "../Card";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import imagex from '../../assets/noproduct.png'
import './style.css'
interface ProductProps {
    id: string,
    status: string,
    name: string,
    description: string,
    price: number,
    rate: number,
    amount: number,
    images: {
        link:string,
        ref: string,
    }[],
    active: boolean
}

interface ProductCardProps {
    product: ProductProps
    ondelete: (id: string) => void
}
const stts = {
    0: <Badge fontSize="sm" cursor="default" pos="absolute" variant="solid" colorScheme="green" top={4} left={4}>
        ativo
    </Badge>,
    1: <Badge fontSize="sm" cursor="default" pos="absolute" variant="solid" colorScheme="gray" top={4} left={4}>
        Desativado
    </Badge>,
    // 2: <Badge fontSize="sm" cursor="default" pos="absolute" variant="solid" colorScheme="red" top={4} left={4}>
    //     esgotado
    // </Badge>
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, ondelete }) => {
    const navigate = useNavigate()
    const getStatus = (active: boolean, amount: number) => {
        if (active) {
            return 0
        }
        // else if (amount < 0 || !amount) {
        //     return 2
        // }
        return 1
    }
    useEffect(()=>{
    }, [])
    return (
        <Card key={product.id} padding={"0 0 1rem 0"}>
            <Flex align={"center"} justify="center" height={300} width={300} overflow={"hidden"} pos={"relative"} roundedTop="lg" >
                <Box>
                    {
                        product.images && product.images.length > 0 ?
                        <Carousel  infiniteLoop width={300} dynamicHeight>
                        {
                            product.images.map(x => <Image src={x.link} height="auto" width="300px" />)
                        }

                    </Carousel>:<Image src={imagex} position="absolute" top={0} left="0" height="auto" width="300px" /> }
                    

                </Box>
                <HStack pos="absolute" top={3} right={4}>
                    <Tooltip label='Editar' placement="left">
                        <IconButton
                            aria-label="Editar"
                            variant={"solid"}
                            rounded="full"
                            colorScheme={"blue"}
                            icon={<BiEdit />}
                            onClick={() => navigate(`editar/${product.id}`)}
                            size={"sm"}
                            fontSize={"1.2rem"}
                        />
                    </Tooltip>
                    <Tooltip label='Excluir' placement="bottom">
                        <IconButton
                            aria-label="Editar"
                            variant={"solid"}
                            rounded="full"
                            colorScheme={"red"}
                            icon={<BiTrash />}
                            size={"sm"}
                            fontSize={"1.2rem"}
                            onClick={() => ondelete(product.id)}
                        />
                    </Tooltip>

                </HStack>

                <Tooltip label='Status'>
                    {
                        stts[getStatus(product.active, product.amount)]
                    }
                </Tooltip>
            </Flex>
            <Flex py={3} px={4} flexDir="column">
                <Heading as="h6" size="sm">
                    {product.name}
                </Heading>
                <Text noOfLines={2} fontSize="sm" mt="2" color="gray.500">
                    {product.description}
                </Text>
                <Flex mt="3" justifyContent="space-between">
                    <Heading color="green.500" size="md" >
                        {currency(product.price)}
                    </Heading>
                    <HStack spacing={1}>
                        <Icon color="yellow.400" as={FaStar} />
                        <Icon color="yellow.400" as={FaStar} />
                        <Icon color="yellow.400" as={FaStar} />
                        <Icon color="yellow.400" as={FaStar} />
                        <Icon color="yellow.400" as={FaStarHalfAlt} />
                    </HStack>
                </Flex>
                <HStack mt={4}>
                    <Tooltip label='Vizualizações'>
                        <Badge px={2} cursor="default" variant="solid" colorScheme="facebook" d="flex" alignItems="center">
                            <Icon w={4} h={4} as={BiLineChart} mr="1" /> 0
                        </Badge>
                    </Tooltip>
                    <Tooltip label='Pedidos'>
                        <Badge px={2} cursor="default" variant="solid" colorScheme="blue" d="flex" alignItems="center">
                            <Icon w={3} h={3} as={FaConciergeBell} mr="1" /> 0
                        </Badge>
                    </Tooltip>
                    <Tooltip label='Avaliações'>
                        <Badge px={2} cursor="default" variant="solid" colorScheme="yellow" d="flex" alignItems="center">
                            <Icon w={3} h={3} as={FaStar} mr="1" /> 0
                        </Badge>
                    </Tooltip>
                    <Tooltip label='Estoque'>
                        <Badge px={2} cursor="default" variant="solid" colorScheme="green" d="flex" alignItems="center">
                            <Icon w={3} h={3} as={FaBoxes} mr="1" /> {product.amount || 0}
                        </Badge>
                    </Tooltip>
                </HStack>


            </Flex>

        </Card>
    )
}