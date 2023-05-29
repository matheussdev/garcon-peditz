import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import api from "../services/api";
import { logout } from "../services/auth";
import { Comapany } from "../types";

interface LoginProviderProps {
  children: ReactNode;
}

interface user {
  email: string;
  name: string;
  telephone: string;
}

interface LoginContextData {
  getUser: () => void;
  user: user;
  company: Comapany | undefined

}

export const LoginContext = createContext<LoginContextData>(
  {} as LoginContextData
);

export function LoginProvider({ children }: LoginProviderProps) {
  

  const [company, setCompany] = useState<Comapany>()

  async function getUser() {
    api.get("/api/users").then(response => {
      setUser({ email: response.data.email, name: response.data.name, telephone: response.data.telephone });
      // setCompany(JSON.parse(localStorage.getItem('@peditzStore') as string) as Comapany)
    }).catch(err => {
      console.log(err.response.data)
      if(err.response.data.statusCode===401){
        logout()
      }
    })
  }

  useEffect(()=>{
    getUser()
  }, [])


  const [user, setUser] = useState<user>({
    name:"",
    email:"",
    telephone:""
  });

  
  
 

  return (
    <LoginContext.Provider
      value={{
        getUser,
        user,
        company
      }}
    >
      {children}
    </LoginContext.Provider>
  );
}

export function useLogin() {
  const context = useContext(LoginContext);
  return context;
}
