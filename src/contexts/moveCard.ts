import {
    ReactNode,
    createContext,
} from "react";

import { IOrderProps } from "../pages/Orders/Orders";

interface IMoveCardProps {
    children: ReactNode;
};

interface IMoveCard {
    orders: IOrderProps[];
    status: string[];
}


export default createContext<IMoveCard>({} as IMoveCard);
