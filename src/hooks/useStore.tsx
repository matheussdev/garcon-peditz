import { createContext, ReactNode, useContext, useState } from "react";
import api from "../services/api";

interface StoreProviderProps {
  children: ReactNode;
}


interface scheduleProps {
  monday: string[];
  tuesday: string[];
  wednesday: string[];
  thursday: string[];
  friday: string[];
  saturday: string[];
  sunday: string[];
}

interface adressProps {
  road: string;
  complement: string;
  district: string;
  number: string;
  zip_code: string;
  latitude: string;
  longitude: string;
  state: string;
  city: string
}

interface storeProps {
  image: string;
  name: string;
  whatsapp: string;
  slug: string;
  instagram: string;
  description: string;
  schedules: scheduleProps;
  address: adressProps;
  category: string;
}

interface StoreContextData {
  getStore: () => void;
  store: storeProps | undefined;
}

export const StoreContext = createContext<StoreContextData>(
  {} as StoreContextData
);

export function StoreProvider({ children }: StoreProviderProps) {
  const [store, setStore] = useState<storeProps>();

  async function getStore() {
    api.get("/establishment").then(response => {
      setStore(response.data)
      // setUser({ email: response.data.email, name: response.data.name, telephone: response.data.telephone });
    }).catch(err => {
      console.log(err.response.data)
    })
  }

  return (
    <StoreContext.Provider
      value={{
        getStore,
        store
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  return context;
}
