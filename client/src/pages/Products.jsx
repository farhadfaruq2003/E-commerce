import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { useAppContext } from "../context/AppContext";

const Products = () => {
  const { products, searchQuery } = useAppContext();
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    if (searchQuery.length > 0) {
      setFilteredProducts(
        products.filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredProducts(products);
    }
  }, [products, searchQuery]);

  return (
    <div className="min-h-screen bg-transparent py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
              {searchQuery ? `Search Results for "${searchQuery}"` : "All Products"}
            </h1>
            <div className="w-16 h-1 bg-indigo-600 mt-3 rounded-full"></div>
          </div>
          
          <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">
            {filteredProducts.length} Products Found
          </p>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
            {filteredProducts
              .filter((product) => (product.inStock !== undefined ? product.inStock : true))
              .map((product) => (
                <div key={product.id || product._id} className="group transition-all duration-300">
                  <ProductCard product={product} />
                </div>
              ))}
          </div>
        ) : (
          /* Empty Search State */
          <div className="flex flex-col items-center justify-center py-32 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">No match found</h2>
            <p className="text-gray-500 mt-2 text-center px-6">
              We couldn't find any products matching your search. <br className="hidden md:block"/> Try using different keywords.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-8 bg-black text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition-all shadow-lg active:scale-95"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;