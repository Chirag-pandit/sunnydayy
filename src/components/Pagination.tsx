import React from 'react';
import { PaginationProps } from '../types';

const Pagination: React.FC<PaginationProps> = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}) => {
  // Generate page numbers array
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if total is less than max to show
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show limited pages with ellipsis
      if (currentPage <= 3) {
        // Near start
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('ellipsis');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near end
        pageNumbers.push(1);
        pageNumbers.push('ellipsis');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // Middle
        pageNumbers.push(1);
        pageNumbers.push('ellipsis');
        pageNumbers.push(currentPage - 1);
        pageNumbers.push(currentPage);
        pageNumbers.push(currentPage + 1);
        pageNumbers.push('ellipsis');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();
  
  return (
    <div className="flex justify-center mt-12">
      <div className="flex items-center">
        <button 
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 mx-1 rounded ${
            currentPage === 1 
              ? 'bg-secondary-dark text-gray-500 cursor-not-allowed' 
              : 'bg-secondary-light text-gray-300 hover:bg-primary hover:text-secondary-dark'
          }`}
          aria-label="Previous page"
        >
          &laquo;
        </button>
        
        {pageNumbers.map((page, index) => {
          if (page === 'ellipsis') {
            return (
              <span key={`ellipsis-${index}`} className="px-4 py-2 mx-1 text-gray-300">
                &hellip;
              </span>
            );
          }
          
          return (
            <button
              key={`page-${page}`}
              onClick={() => onPageChange(Number(page))}
              className={`px-4 py-2 mx-1 rounded ${
                currentPage === page 
                  ? 'bg-primary text-secondary-dark' 
                  : 'bg-secondary-light text-gray-300 hover:bg-primary hover:text-secondary-dark'
              }`}
            >
              {page}
            </button>
          );
        })}
        
        <button 
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 mx-1 rounded ${
            currentPage === totalPages 
              ? 'bg-secondary-dark text-gray-500 cursor-not-allowed' 
              : 'bg-secondary-light text-gray-300 hover:bg-primary hover:text-secondary-dark'
          }`}
          aria-label="Next page"
        >
          &raquo;
        </button>
      </div>
    </div>
  );
};

export default Pagination;