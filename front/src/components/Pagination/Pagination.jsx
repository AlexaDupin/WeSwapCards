import React from 'react';
import { Pagination } from 'react-bootstrap';
import './paginationStyles.scss';

const PaginationControl = ({ activePage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  
  // Create array to hold pagination items
  const paginationItems = [];
  
  // Always add page 1
  paginationItems.push(
    <Pagination.Item 
      key={1} 
      active={activePage === 1} 
      onClick={() => onPageChange(1)}
    >
      1
    </Pagination.Item>
  );
  
  // Calculate the range to display (3 pages around current)
  let startPage = Math.max(2, activePage - 1);
  let endPage = Math.min(totalPages - 1, activePage + 1);
  
  // Adjust range to ensure we show 3 pages when possible
  if (activePage <= 3) {
    // Near the start, show pages 2, 3, 4
    startPage = 2;
    endPage = Math.min(4, totalPages - 1);
  } else if (activePage >= totalPages - 2) {
    // Near the end, show last 3 pages before the final page
    endPage = totalPages - 1;
    startPage = Math.max(2, totalPages - 3);
  }
  
  // Add first ellipsis if needed
  if (startPage > 2) {
    paginationItems.push(<Pagination.Ellipsis key="ellipsis1" disabled />);
  }
  
  // Add the middle pages
  for (let i = startPage; i <= endPage; i++) {
    paginationItems.push(
      <Pagination.Item 
        key={i} 
        active={activePage === i} 
        onClick={() => onPageChange(i)}
      >
        {i}
      </Pagination.Item>
    );
  }
  
  // Add second ellipsis if needed
  if (endPage < totalPages - 1) {
    paginationItems.push(<Pagination.Ellipsis key="ellipsis2" disabled />);
  }
  
  // Always add the last page if there is more than one page
  if (totalPages > 1) {
    paginationItems.push(
      <Pagination.Item 
        key={totalPages} 
        active={activePage === totalPages} 
        onClick={() => onPageChange(totalPages)}
      >
        {totalPages}
      </Pagination.Item>
    );
  }
  
  return (
    <div className="d-flex justify-content-center mt-4">
      <Pagination>
        <Pagination.Prev 
          onClick={() => onPageChange(activePage - 1)} 
          disabled={activePage === 1} 
        />
        
        {paginationItems}
        
        <Pagination.Next 
          onClick={() => onPageChange(activePage + 1)} 
          disabled={activePage === totalPages} 
        />
      </Pagination>
    </div>
  );
};

export default PaginationControl;