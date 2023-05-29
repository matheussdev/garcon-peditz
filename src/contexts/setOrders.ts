import {
    ReactNode,
    createContext,
    useEffect,
    useState,
    SetStateAction,
} from "react";

import { IOrderProps } from "../pages/Orders/Orders";

interface IOrderCardProvider {
    children: ReactNode;
};

interface IOrderCardProps {
    orders: IOrderProps[];
    statusColumns: string[];
    setOrders: (value: IOrderProps[]) => void;
    setStatusColumns: (value: string[]) => void;
}

export default createContext<IOrderCardProps>({} as IOrderCardProps);

export const OrderCardProvider = ({children}: IOrderCardProvider) => {
    
    const [ orders, setOrders ] = useState<IOrderProps[]>([]);
    const [ status, setStatus ] = useState("");
   
}