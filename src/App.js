import React, { useState } from "react";
import './App.css';
import { useQuery, gql } from "@apollo/client";

// GraphQL query to fetch paginated products
const GET_PRODUCTS_WITH_PAGEINFO = gql`
  query GetProductsWithPageInfo($page: Int, $limit: Int) {
    productsWithPageInfo(page: $page, limit: $limit) {
      products {
        id
        title
        price
        description
        category
        image
      }
      pageInfo {
        total
        currentPage
        totalPages
      }
    }
  }
`;

function App() {
  const [page, setPage] = useState(1);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // To control popup visibility
  const [selectedProduct, setSelectedProduct] = useState(null); // Store the selected product details
  const limit = 10;

  const { loading, error, data } = useQuery(GET_PRODUCTS_WITH_PAGEINFO, {
    variables: { page, limit },
  });

  if (loading)
    return (
      <div className="loader-container">
        <div>
          <div className="loader"></div>
          <p className="loading-text">Loading products...</p>
        </div>
      </div>
    );
  
  if (error) return <p>Error: {error.message}</p>;

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > data.productsWithPageInfo.pageInfo.totalPages) return;
    setPage(newPage);
  };

  const openPopup = (product) => {
    setSelectedProduct(product);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedProduct(null);
  };

  const handleOverlayClick = (e) => {
    // Check if the click is on the overlay itself (outside the popup)
    if (e.target.classList.contains("popup-overlay")) {
      closePopup();
    }
  };

  const { products, pageInfo } = data.productsWithPageInfo;

  return (
    <div className="container">
      <h1>Product Catalog</h1>
      <div className="product-list">
        {products.map((product) => (
          <div 
            key={product.id} 
            className="product-card" 
            onClick={() => openPopup(product)} // Open popup on product click
          >
            <img src={product.image} alt={product.title} />
            <h2>{product.title}</h2>
            <p>{product.description}</p>
            <p className="price">${product.price}</p>
            <p className="category">{product.category}</p>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="pagination">
        <button onClick={() => handlePageChange(page - 1)} disabled={page <= 1}>
          Previous
        </button>
        <span>Page {pageInfo.currentPage} of {pageInfo.totalPages}</span>
        <button onClick={() => handlePageChange(page + 1)} disabled={page >= pageInfo.totalPages}>
          Next
        </button>
      </div>

      {/* Popup Modal */}
      {isPopupOpen && selectedProduct && (
        <div className="popup-overlay" onClick={handleOverlayClick}>
          <div className="popup" onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button className="close-btn" onClick={closePopup}>X</button>

            {/* Horizontal Layout Content */}
            <div className="popup-content">
              {/* Image on the left */}
              <img src={selectedProduct.image} alt={selectedProduct.title} />

              {/* Text content on the right */}
              <div className="details">
                <h2>{selectedProduct.title}</h2>
                <div className="description">
                  <p>{selectedProduct.description}</p>
                </div>
                <p className="price">${selectedProduct.price}</p>
                <p className="category">{selectedProduct.category}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
