import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Flex } from "@chakra-ui/react";

import CartContext from "../../contexts/CartProducts";

import { CartOrder } from "../../components/CartOrder";
import { ProductsNewOrder } from "../../components/ProductsNewOrder";

export interface IProductCart {
  id: string;
  name: string;
  price: number;
  qtd: number;
}

interface ItemsToSend {
  id: string;
  amount: number;
}

interface complementsToSend {
  id: string;
  itens: ItemsToSend[];
}
interface ProductToSend {
  productId: string;
  price: number;
  amount: number;
  name: string;
  obs: string;
  complements: complementsToSend[];
}

export function CreateNewOrder() {
  const [cartProducts, setCartProducts] = useState<IProductCart[]>([]);
  const [cart, setCart] = useState<ProductToSend[]>([]);

  useEffect(() => {
    // console.log(cartProducts);
  }, [cartProducts.length]);

  return (
    <CartContext.Provider value={{ cartProducts, setCartProducts }}>
      <Flex w={"100%"} flexDir="column" h={"100%"} gap={4}>
        <ProductsNewOrder cart={cart} onAddCart={(cart) => setCart(cart)} />
        <CartOrder updateCart={(cart) => setCart(cart)} cart={cart} />
      </Flex>
    </CartContext.Provider>
  );
}
