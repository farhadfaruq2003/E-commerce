import { categories } from "../assets/assets";
import ProductCard from "../components/ProductCard";
import { useAppContext } from "../context/AppContext";
import { useParams } from "react-router-dom";

const ProductCategory = () => {
  const { products, isLoading } = useAppContext();
  const { category } = useParams();

  const searchCategory = categories.find(
    (item) => item.path.toLowerCase() === category.toLowerCase()
  );

  // Filter products by matching the category path (not the URL parameter)
  const filteredProducts = products.filter(
    (product) =>
      product.category && 
      searchCategory && 
      product.category.toLowerCase() === searchCategory.path.toLowerCase()
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          <h1 className="text-xl font-medium text-gray-600">Loading Products...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Category Header Section */}
        {searchCategory ? (
          <div className="relative mb-12 flex flex-col items-center md:items-start">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
              {searchCategory.text}
            </h1>
            <div className="w-24 h-1.5 bg-indigo-600 mt-4 rounded-full"></div>
            <p className="mt-4 text-gray-500 text-lg max-w-2xl text-center md:text-left">
              Explore our exclusive collection of {searchCategory.text.toLowerCase()} crafted with quality and style in mind.
            </p>
          </div>
        ) : (
          <div className="mb-12">
            <h1 className="text-3xl font-bold text-gray-900 capitalize italic">
              Explore {category}
            </h1>
          </div>
        )}

        {/* Product Grid Area */}
        {filteredProducts.length > 0 ? (
          <div className="space-y-10">
            <div className="flex justify-between items-center border-b pb-4">
               <p className="text-sm text-gray-500 font-medium uppercase tracking-widest">
                Showing {filteredProducts.length} Products
               </p>
               {/* Optional: Filter/Sort placeholder */}
               <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer">
                  <span>Sort by: Featured</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M6 9l6 6 6-6"/></svg>
               </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
              {filteredProducts
                .filter((product) => (product.inStock !== undefined ? product.inStock : true))
                .map((product) => (
                  <div key={product.id || product._id} className="transform transition-all duration-300 hover:-translate-y-1">
                    <ProductCard product={product} />
                  </div>
                ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
             <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
             </div>
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
              Oops! No Products Found
            </h2>
            <p className="text-gray-500 mt-2">
              We couldn't find any products in this category right now.
            </p>
            <button 
              onClick={() => window.history.back()}
              className="mt-8 bg-black text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors"
            >
              Go Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCategory;