import React, {Dispatch, memo, SetStateAction, useCallback} from 'react';
import {Pagination} from "react-bootstrap";

interface IBasePaginationProps {
  currentPage: number,
  totalPages: number,
  meta: any,
  setCurrPage: Dispatch<SetStateAction<number>>
}

function BasePagination({currentPage, meta, totalPages, setCurrPage}: IBasePaginationProps) {
  const pages = new Array(totalPages).fill(null).map((_, idx) => idx + 1)
  const handlePageChange = useCallback((page: number) => {
    if (page > 0 && page <= meta?.totalPages) {
      setCurrPage(page)
    }
  }, [meta?.totalPages, setCurrPage])
  return (
    <Pagination>
      <Pagination.Prev disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)} />
      {pages.map((page) =>
        <Pagination.Item
          active={page === currentPage}
          onClick={() => handlePageChange(page)}
          key={page}>{page}
        </Pagination.Item>)}
      <Pagination.Next disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)} />
    </Pagination>
  );
}

export default memo(BasePagination);