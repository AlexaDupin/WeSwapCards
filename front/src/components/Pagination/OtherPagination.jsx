function AnotherListComponent() {
    const { 
      data: items, 
      loading, 
      error,
      activePage, 
      totalPages,
      handlePageChange 
    } = usePagination('/api/items', 10);  // Different endpoint, different items per page
  
    return (
      <div>
        {/* Your list rendering */}
        
        <PaginationControl 
          activePage={activePage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    );
  }