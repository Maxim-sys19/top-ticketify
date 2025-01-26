import React from "react";

export enum UserRole {
  USER = 'user',
  COMPANY_USER = 'company_user',
  ADMIN_USER = 'admin_user',
}

export interface Column<T> {
  header: string,
  accessor?: keyof T | ((row: T) => React.ReactNode)
}

export interface TableConfig<T> {
  columns?: Column<T>[],
  data: T[],
  role?: boolean
}