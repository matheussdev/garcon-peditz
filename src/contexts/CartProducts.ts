import { createContext } from "react";
import { IProductCart } from "../pages/CreateNewOrder/CreateNewOrder";

interface IContextProps {
  cartProducts: IProductCart[];
  setCartProducts: (value: IProductCart[]) => void;
}

export default createContext<IContextProps>({} as IContextProps);
