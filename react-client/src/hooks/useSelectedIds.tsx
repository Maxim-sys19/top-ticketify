import {useCallback, useEffect, useState} from "react"

function useSelectedIds<T>(initialIds: T[]) {
  const [selectIds, setSelectIds] = useState<Set<T>>(new Set(initialIds))
  useEffect(() => {
    setSelectIds(new Set(initialIds))
  }, [JSON.stringify(initialIds)]);
  const toggleIdSelection = useCallback((id: T) => {
    setSelectIds((prev) => {
      const newSet = new Set(prev)
      newSet.has(id) ? newSet.delete(id) : newSet.add(id)
      return newSet
    })
  }, [])
  const clearSelection = useCallback(() => {
    setSelectIds(new Set())
  }, [])
  return {selectIds, toggleIdSelection, clearSelection}
}

export default useSelectedIds

export function useSelectRow<T extends Record<string, any> | any[] | null>(initialRow: T) {
  const [selectRow, setSelectRow] = useState<T | null>(initialRow)
  useEffect(() => {
    setSelectRow(initialRow)
  }, [JSON.stringify(initialRow)])
  const setSelectedRow = (row: T) => {
    setSelectRow(row)
  }
  const clearSelectedRow = () => {
    setSelectRow((prev: T | null) => {
      if(!prev) return initialRow as T
      if(prev === null) return null
      if(Array.isArray(prev)) return [] as unknown as T
      return Object.fromEntries(
        Object.keys(prev).map((key) => [key, ""])
      ) as T
    })
  };
  return {selectRow, setSelectedRow, clearSelectedRow}
}