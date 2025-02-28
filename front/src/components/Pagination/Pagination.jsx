import React from 'react';
import { Pagination } from 'react-bootstrap';
import './paginationStyles.scss';

const PaginationControl = ({ 
  activePage, 
  totalPages, 
  onPageChange,
  maxPagesDisplayed = 5
}) => {
  if (totalPages <= 1) return null;
  
  return (
    <div className="d-flex justify-content-center mt-4">
      <Pagination>
        <Pagination.First 
          onClick={() => onPageChange(1)} 
          disabled={activePage === 1} 
        />
        <Pagination.Prev 
          onClick={() => onPageChange(activePage - 1)} 
          disabled={activePage === 1} 
        />
        
        {Array.from({ length: Math.min(maxPagesDisplayed, totalPages) }).map((_, idx) => {
          const pageNum = activePage - Math.min(2, activePage - 1) + idx;
          if (pageNum > 0 && pageNum <= totalPages) {
            return (
              <Pagination.Item
                key={pageNum}
                active={pageNum === activePage}
                onClick={() => onPageChange(pageNum)}
              >
                {pageNum}
              </Pagination.Item>
            );
          }
          return null;
        })}
        
        {activePage + 2 < totalPages && (
          <>
            <Pagination.Ellipsis disabled />
            <Pagination.Item onClick={() => onPageChange(totalPages)}>
              {totalPages}
            </Pagination.Item>
          </>
        )}
        
        <Pagination.Next 
          onClick={() => onPageChange(activePage + 1)} 
          disabled={activePage === totalPages} 
        />
        <Pagination.Last 
          onClick={() => onPageChange(totalPages)} 
          disabled={activePage === totalPages} 
        />
      </Pagination>
    </div>
  );
};

export default PaginationControl;