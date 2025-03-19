import React, { useState, useEffect } from 'react';
import { searchPCCases } from '../services/api';

const Search = ({ onAddToCompare }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const loadItems = async (page = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      const skip = (page - 1) * itemsPerPage;
      const result = await searchPCCases(searchQuery, itemsPerPage, skip);
      
      setSearchResults(result.data || []);
      // Set total pages based on the total number of parts
      const totalItems = result.totalParts || 0;
      setTotalPages(Math.ceil(totalItems / itemsPerPage));
      setCurrentPage(page);
    } catch (err) {
      setError('Failed to load PC cases. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Load all items on initial render
  useEffect(() => {
    loadItems(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = async (e, page = 1) => {
    if (e) e.preventDefault();
    loadItems(page);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    loadItems(page);
  };

  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value);
    setItemsPerPage(newItemsPerPage);
    loadItems(1);
  };

  const handleAddToCompare = (item) => {
    onAddToCompare(item);
  };

  return (
    <div className="search-container">
      <div className="filter-bar">
        <div className="search-box">
          <form onSubmit={(e) => handleSearch(e, 1)}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="search-input"
            />
          </form>
        </div>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="results-container">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            <table className="results-table">
              <thead>
                <tr>
                  <th className="name-column">Name</th>
                  <th className="form-column">Form <span className="sort-icon">↕</span></th>
                  <th className="price-column">Price <span className="sort-icon">↕</span></th>
                  <th className="action-column"></th>
                </tr>
              </thead>
              <tbody>
                {searchResults.map((item) => (
                  <tr key={item.buildcores_id} className="result-row">
                    <td className="name-cell">
                      <div className="product-info">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="product-image"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/50?text=No+Image';
                          }}
                        />
                        <span className="product-name">{item.name}</span>
                      </div>
                    </td>
                    <td className="form-cell">{item.formFactor || 'N/A'}</td>
                    <td className="price-cell">{item.price ? `$${item.price.toFixed(2)}` : '$0.00'}</td>
                    <td className="action-cell">
                      <button
                        onClick={() => handleAddToCompare(item)}
                        className="add-button"
                      >
                        + Add
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {searchResults.length === 0 && !loading && (
              <div className="no-results">
                {searchQuery ? `No results found for "${searchQuery}"` : 'No PC cases found'}
              </div>
            )}

            {searchResults.length > 0 && (
              <div className="pagination">
                <div className="pagination-controls">
                  <div className="rows-per-page">
                    <span>Rows per page</span>
                    <select 
                      value={itemsPerPage} 
                      onChange={handleItemsPerPageChange}
                      className="per-page-select"
                    >
                      <option value="10">10</option>
                      <option value="20">20</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                    </select>
                  </div>
                  
                  <div className="page-info">
                    Page {currentPage} of {totalPages}
                  </div>
                  
                  <div className="page-buttons">
                    <button 
                      className="page-button" 
                      onClick={() => handlePageChange(1)}
                      disabled={currentPage === 1}
                    >
                      ≪
                    </button>
                    <button 
                      className="page-button" 
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      ＜
                    </button>
                    <button 
                      className="page-button" 
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      ＞
                    </button>
                    <button 
                      className="page-button" 
                      onClick={() => handlePageChange(totalPages)}
                      disabled={currentPage === totalPages}
                    >
                      ≫
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Search; 