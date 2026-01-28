import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Link, useParams } from "react-router-dom";
import { assets, getProductImage } from "../assets/assets";
import ProductCard from "../components/ProductCard";

const SingleProduct = () => {
  const { products, navigate, addToCart } = useAppContext();
  const { id } = useParams();

  const [currentProduct, setCurrentProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (products.length > 0 && id) {
      const foundProduct = products.find(
        (p) => String(p._id) === String(id) || String(p.id) === String(id)
      );
      setCurrentProduct(foundProduct);
      window.scrollTo(0, 0);
    }
  }, [products, id]);

  useEffect(() => {
    if (products.length > 0 && currentProduct) {
      let filtered = products.filter(
        (item) =>
          item.category === currentProduct.category &&
          String(item._id) !== String(currentProduct._id) &&
          String(item.id) !== String(currentProduct.id)
      );
      setRelatedProducts(filtered.slice(0, 5));
    }
  }, [products, currentProduct]);

  if (!currentProduct) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-600 mb-4"></div>
        <p className="text-gray-500 font-medium">Loading Product Details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8 overflow-x-auto whitespace-nowrap pb-2">
          <Link to="/" className="hover:text-black transition-colors">Home</Link>
          <span className="text-gray-300">/</span>
          <Link to="/products" className="hover:text-black transition-colors">Products</Link>
          <span className="text-gray-300">/</span>
          <Link 
            to={`/products/${currentProduct.category.toLowerCase()}`} 
            className="hover:text-black transition-colors capitalize"
          >
            {currentProduct.category}
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-indigo-600 font-medium truncate">{currentProduct.name}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12 xl:gap-20">
          
          {/* Left: Image Gallery (Professional Look) */}
          <div className="flex-1">
            <div className="sticky top-8 bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 group">
              <img
                src={getProductImage(currentProduct.name) || (currentProduct.image && (Array.isArray(currentProduct.image) ? currentProduct.image[0] : currentProduct.image))}
                alt={currentProduct.name}
                className="w-full h-auto object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="flex-1 py-2">
            <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-4">
              {currentProduct.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
              {currentProduct.name}
            </h1>

            {/* Ratings */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <img
                    key={i}
                    src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                    alt="star"
                    className="w-4 h-4"
                  />
                ))}
              </div>
              <p className="text-sm font-semibold text-gray-400 border-l pl-3">(4.0 Ratings)</p>
            </div>

            {/* Pricing Section */}
            <div className="bg-gray-50 p-6 rounded-2xl mb-8">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-gray-900">৳{currentProduct.offerPrice}</span>
                <span className="text-lg text-gray-400 line-through">৳{currentProduct.price}</span>
                <span className="text-green-600 text-sm font-bold bg-green-50 px-2 py-0.5 rounded">
                  {Math.round(((currentProduct.price - currentProduct.offerPrice) / currentProduct.price) * 100)}% OFF
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2 italic">Inclusive of all taxes and shipping fees.</p>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Product Overview</h3>
              <ul className="space-y-2">
                {Array.isArray(currentProduct.description) ? (
                  currentProduct.description.map((desc, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-600 text-sm leading-relaxed">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0"></span>
                      {desc}
                    </li>
                  ))
                ) : (
                  <li className="text-gray-600 text-sm leading-relaxed">{currentProduct.description}</li>
                )}
              </ul>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-6 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-6">
                <span className="font-bold text-gray-700">Select Quantity</span>
                <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    className="px-4 py-2 hover:bg-gray-100 transition-colors font-bold text-lg"
                  >–</button>
                  <span className="px-4 py-2 font-bold text-gray-900 border-x-2 border-gray-100">{quantity}</span>
                  <button
                    onClick={() => setQuantity((prev) => prev + 1)}
                    className="px-4 py-2 hover:bg-gray-100 transition-colors font-bold text-lg"
                  >+</button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button
                  onClick={() => { addToCart(currentProduct.id, quantity); }}
                  className="flex-1 py-4 px-8 rounded-2xl border-2 border-black font-bold text-black hover:bg-black hover:text-white transition-all duration-300 shadow-sm active:scale-95 cursor-pointer"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => {
                    addToCart(currentProduct.id, quantity);
                    navigate("/cart");
                  }}
                  className="flex-1 py-4 px-8 rounded-2xl bg-indigo-600 font-bold text-white hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all duration-300 active:scale-95 cursor-pointer"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-32">
          <div className="flex flex-col items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">You Might Also Like</h2>
            <div className="w-12 h-1 bg-indigo-500 rounded-full mt-3"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {relatedProducts
              .filter((product) => product.inStock !== undefined ? product.inStock : true)
              .map((product) => (
                <ProductCard key={product.id || product._id} product={product} />
              ))}
          </div>

          <div className="flex justify-center mt-12">
            <button
              onClick={() => { navigate("/products"); window.scrollTo(0, 0); }}
              className="px-12 py-3.5 border-2 border-gray-200 rounded-full font-bold text-gray-600 hover:border-black hover:text-black transition-all cursor-pointer"
            >
              Discover More Products
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;