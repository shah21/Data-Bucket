import {createContext} from "react";


const initialState = {
    flash:{
    message:undefined! as string,
    type:undefined! as string,
    },
    setFlash:null as any,
};
export const FlashContext = createContext(initialState);