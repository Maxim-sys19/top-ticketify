import {createContext, useContext} from "react";
import {CreateRouteInputTypes} from "../../interfaces/routes/route-handles-interface";

const RouteContext = createContext<CreateRouteInputTypes | null>(null)
const useRouteContext = () => {
  const ctx = useContext(RouteContext)
  if(!ctx) throw new Error("useRouteContext must be used within RouteProvider")
  return ctx
}

export {RouteContext, useRouteContext}