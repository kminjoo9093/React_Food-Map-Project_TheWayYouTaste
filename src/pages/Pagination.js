// src/components/Pagination.js
import React from "react";
import stylePagination from "../css/Pagination.module.css";

function Pagination({ nowPage, totalItems, itemsPerPage, limitBlock, onPageChange }) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const nowBlock = Math.floor((nowPage - 1) / limitBlock);
  const startPage = nowBlock * limitBlock + 1;
  const endPage = Math.min(startPage + limitBlock - 1, totalPages);

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);
  const goFirst = () =>{
    if( nowPage > 1 ) onPageChange(1);
  };
  const goPrev = () => {
    if (nowPage > 1) onPageChange(nowPage - 1);
  };

  const goNext = () => {
    if (nowPage < totalPages) onPageChange(nowPage + 1);
  };
  const goLast = () =>{
    if( nowPage < totalPages ) onPageChange(totalPages);
  };

  return (
    <div className={stylePagination.pagination}>
      <button onClick={goFirst} disabled={nowPage === 1} className={stylePagination.button}> {"<<"} </button>
      <button onClick={goPrev} disabled={nowPage === 1} className={stylePagination.button}>{"<"}</button>
      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`${nowPage === number ? stylePagination.active : ""} ${stylePagination.button}`}
        >
          {number}
        </button>
      ))}
      <button onClick={goNext} disabled={nowPage === totalPages} className={stylePagination.button}>{">"}</button>
      <button onClick={goLast} disabled={nowPage === totalPages} className={stylePagination.button}>{">>"}</button>
    </div>
  );
}

export default Pagination;
