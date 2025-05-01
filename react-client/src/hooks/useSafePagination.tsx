import {useEffect, useState} from "react";

interface UseSafePaginationProps<T> {
  data: T[];
  total?: number;
  currPage: number;
  setCurrPage: (page: number | ((prev: number) => number)) => void;
  isLoading: boolean;
}

export function useSafePagination<T>({data, total, currPage, setCurrPage, isLoading}: UseSafePaginationProps<T>) {
  const [wasDeleted, setWasDeleted] = useState(false)
  const notifyDeleted = () => {
    setWasDeleted(true)
  }
  useEffect(() => {
    const isPageEmpty = data?.length === 0
    const hasMoreData = (total ?? 0) > 0
    if (!isLoading && wasDeleted && isPageEmpty && hasMoreData && currPage > 1) {
      setCurrPage((prev) => Math.max(prev - 1, 1))
      setWasDeleted(false)
    }
  }, [wasDeleted, data, total, currPage, setCurrPage, isLoading])
  return {notifyDeleted}
}