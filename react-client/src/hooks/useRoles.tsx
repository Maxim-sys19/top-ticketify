import { useCallback, useMemo } from "react"
import { useAppDispatch, useAppSelector } from "./useApiHooks"

export function useRoles() {
  const token = useAppSelector(state => state.jwtToken.token)
  const {roles} = useAppSelector(state => state.profile.user)
  const stringifyRoles = JSON.stringify(roles)
  const isAdmin = useCallback(() => {
    return roles && roles.some(role => role.role_name.includes('admin_user'))
  }, [stringifyRoles])
  const isCompany = useCallback(() => {
    return roles && roles.some(role => role.role_name.includes('company_user'))
  }, [stringifyRoles])
  const isAuth = useMemo(() => token === null, [token]);
  return {isAdmin, isCompany, isAuth}
}