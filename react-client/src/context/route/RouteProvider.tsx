import {RouteContext} from "./RouteContext";
import {ReactNode} from "react";
import {CreateRouteInputTypes} from "../../interfaces/routes/route-handles-interface";

interface RouteProviderProps {
  initialValues: CreateRouteInputTypes,
  children: ReactNode
}

export const RouteProvider = ({children, initialValues}: RouteProviderProps) => {
  return (
    <RouteContext.Provider value={initialValues}>
      {children}
    </RouteContext.Provider>
  )
}