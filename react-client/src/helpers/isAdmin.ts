export const isAdmin = (roles: any[]) => {
  return roles.some(role => role.role_name.includes('admin_user') || role.role_name.includes('company_user'))
}