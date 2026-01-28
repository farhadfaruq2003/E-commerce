import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";
import { getProductImage } from "../../assets/assets";
import { useEffect, useState } from "react";

const ProductList = () => {
  const { axios } = useAppContext();
  const [sellerProducts, setSellerProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch seller-specific products
  const fetchSellerProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/product/seller-products");
      if (data.success) {
        setSellerProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellerProducts();
  }, []);

  const toggleStock = async (id, inStock) => {
    try {
      const { data } = await axios.post("/api/product/stock", { id, inStock });
      if (data.success) {
        fetchSellerProducts(); // Refresh seller products
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getImageUrl = (product) => {
    // First check if there's a hardcoded image in assets
    const assetImage = getProductImage(product.name);
    if (assetImage) return assetImage;

    // Parse the image array
    let imageArray = [];
    if (Array.isArray(product.image)) {
      imageArray = product.image;
    } else if (typeof product.image === 'string') {
      try {
        imageArray = JSON.parse(product.image.replace(/'/g, '"'));
      } catch {
        imageArray = [product.image];
      }
    }

    const firstImage = imageArray[0] || '';
    
    // Check if it's an external URL
    if (firstImage.startsWith('http://') || firstImage.startsWith('https://')) {
      return firstImage;
    }
    
    // Otherwise it's a local upload
    return `${import.meta.env.VITE_BACKEND_URL}/images/${firstImage}`;
  };

  if (loading) {
    return (
      <div className="flex-1 py-10 flex items-center justify-center">
        <p className="text-gray-500">Loading products...</p>
      </div>
    );
  }
  return (
    <div className="flex-1 py-10 flex flex-col justify-between">
      <div className="w-full md:p-10 p-4">
        <h2 className="pb-4 text-lg font-medium">My Products ({sellerProducts.length})</h2>
        {sellerProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <p className="text-lg mb-2">No products yet</p>
            <p className="text-sm">Add your first product to get started!</p>
          </div>
        ) : (
          <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
            <table className="md:table-auto table-fixed w-full overflow-hidden">
              <thead className="text-gray-900 text-sm text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold truncate">Product</th>
                  <th className="px-4 py-3 font-semibold truncate">Category</th>
                  <th className="px-4 py-3 font-semibold truncate hidden md:block">
                    Selling Price
                  </th>
                  <th className="px-4 py-3 font-semibold truncate">In Stock</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-500">
                {sellerProducts.map((product) => (
                  <tr key={product._id || product.id} className="border-t border-gray-500/20">
                    <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                      <div className="border border-gray-300 rounded p-2">
                        <img
                          src={getImageUrl(product)}
                          alt={product.name}
                          className="w-16 h-16 object-cover"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/64?text=No+Image';
                          }}
                        />
                      </div>
                      <span className="truncate max-sm:hidden w-full">
                        {product.name}
                      </span>
                    </td>
                    <td className="px-4 py-3">{product.category}</td>
                    <td className="px-4 py-3 max-sm:hidden">
                      ${product.offerPrice}
                    </td>
                    <td className="px-4 py-3">
                      <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={product.inStock}
                          onChange={() =>
                            toggleStock(product._id || product.id, !product.inStock)
                          }
                        />
                        <div className="w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200"></div>
                        <span className="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                      </label>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
export default ProductList;
