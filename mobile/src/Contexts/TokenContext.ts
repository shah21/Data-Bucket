import {createContext} from "react";
// import { UserToken } from "../Hooks/useToken";


const initialState = {
  token: {
    accessToken: undefined!,
    refreshToken: undefined!,
    userId: undefined!,
  } as UserToken,
  setToken:null as any,
};
export const TokenContext = createContext(initialState);


