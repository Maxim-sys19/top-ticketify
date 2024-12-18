import React, {memo} from 'react';
import {Pagination} from "react-bootstrap";

interface IBasePaginationProps {
  currentPage: number,
  totalPages: number,
  onPageChange: (page: number) => void
}

function BasePagination({currentPage, totalPages, onPageChange}: IBasePaginationProps) {
  const pages = new Array(totalPages).fill(null).map((_, idx) => idx + 1)
  return (
    <Pagination>
      <Pagination.Prev disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}/>
      {pages.map((page) => <Pagination.Item active={page === currentPage} onClick={() => onPageChange(page)} key={page}>{page}</Pagination.Item>)}
      <Pagination.Next disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}/>
    </Pagination>
  );
}

export default memo(BasePagination);