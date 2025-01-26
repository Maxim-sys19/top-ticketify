export const isAdmin = (roles: any[]) => {
  return roles.some(role => role.role_name.includes('admin_user'))
}
export const isCompany = (roles: any[]) => {
  return roles.some(role => role.role_name.includes('company_user'))
}