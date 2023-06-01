import { matchRoutes, useLocation } from "react-router-dom"

export const routes = [{ path: "/" }, { path: "logs" }]

export const useCurrentPath = () => {
    const location = useLocation()
    const [{ route }]: any = matchRoutes(routes, location)

    return route.path
}