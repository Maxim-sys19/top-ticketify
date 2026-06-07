export const getNestedValue = (obj: any, path: string) => {
  return path.split('.').reduce((acc, key) => acc?.[key], obj)
}
export const getRootName = (path: string) => {
  return path.split('.')[0]
}