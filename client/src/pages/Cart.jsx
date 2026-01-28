import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { getProductImage } from "../assets/assets";
import toast from "react-hot-toast";

const Cart = () => {
  const {
    products,
    navigate,
    cartCount,
    totalCartAmount,
    cartItems,
    setCartItems,
    removeFromCart,
    updateCartItem,
    axios,
    user,
    isLoading,
  } = useAppContext();

  const [cartArray, setCartArray] = useState([]);
  const [address, setAddress] = useState([]);
  const [showAddress, setShowAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentOption, setPaymentOption] = useState("COD");

  const getCart = () => {
    let tempArray = [];
    for (const key in cartItems) {
      const product = products.find(
        (product) => String(product._id) === String(key) || String(product.id) === String(key)
      );
      if (product) {
        product.quantity = cartItems[key];
        tempArray.push(product);
      }
    }
    setCartArray(tempArray);
  };

  const getAddress = async () => {
    try {
      const { data } = await axios.get("/api/address/get");
      if (data.success) {
        setAddress(data.addresses);
        if (data.addresses.length > 0) {
          setSelectedAddress(data.addresses[0]);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      getAddress();
    }
  }, [user]);

  useEffect(() => {
    if (products.length > 0 && cartItems) {
      getCart();
    }
  }, [products, cartItems]);

  const placeOrder = async () => {
    try {
      if (!selectedAddress) {
        return toast.error("Please select an address");
      }
      if (paymentOption === "COD") {
        const { data } = await axios.post("/api/order/cod", {
          items: cartArray.map((item) => ({
            product: item._id,
            quantity: item.quantity,
          })),
          amount: totalCartAmount() + (totalCartAmount() * 2) / 100,
          address: selectedAddress._id,
        });
        if (data.success) {
          toast.success(data.message);
          setCartItems({});
          navigate("/my-orders");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return products.length > 0 && cartItems ? (
    <div className="bg-[#fcfcfc] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Shopping Cart <span className="text-indigo-600 ml-2 font-normal text-lg">({cartCount()} items)</span>
        </h1>

        <div className="flex flex-col lg:flex-row gap-10 items-start">
          {/* Left: Cart Items List */}
          <div className="flex-1 w-full space-y-4">
            <div className="hidden md:grid grid-cols-4 border-b pb-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">
              <div className="col-span-2">Product</div>
              <div className="text-center">Quantity</div>
              <div className="text-right">Price</div>
            </div>

            {cartArray.map((product, index) => (
              <div
                key={index}
                className="flex flex-col md:grid md:grid-cols-4 items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="col-span-2 flex items-center gap-4 w-full">
                  <div
                    onClick={() => navigate(`/product/${product.category}/${product._id || product.id}`)}
                    className="w-24 h-24 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden border cursor-pointer group"
                  >
                    <img
                      className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform"
                      src={getProductImage(product.name) || (Array.isArray(product.image) ? product.image[0] : product.image)}
                      alt={product.name}
                    />
                  </div>
                  <div className="flex flex-col flex-1">
                    <h3 className="font-semibold text-gray-800 line-clamp-1">{product.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">Weight: {product.weight || "N/A"}</p>
                    <button
                      onClick={() => removeFromCart(product._id || product.id)}
                      className="text-red-500 text-xs font-medium flex items-center gap-1 mt-3 hover:text-red-600 transition-colors cursor-pointer"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                      Remove
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2">
                  <span className="md:hidden text-sm text-gray-500">Qty:</span>
                  <select
                    onChange={(e) => updateCartItem(product._id || product.id, Number(e.target.value))}
                    value={cartItems[product._id || product.id]}
                    className="bg-gray-50 border rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                </div>

                <div className="text-right w-full md:w-auto">
                  <p className="text-lg font-bold text-gray-900">৳{(product.offerPrice * product.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}

            <button
              onClick={() => navigate("/products")}
              className="mt-6 flex items-center gap-2 text-indigo-600 font-semibold hover:translate-x-[-4px] transition-transform cursor-pointer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
              Continue Shopping
            </button>
          </div>

          {/* Right: Order Summary Sidebar */}
          <div className="w-full lg:w-[380px] bg-white p-6 rounded-2xl border border-gray-100 shadow-xl lg:sticky lg:top-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-gray-700 uppercase">Shipping To</label>
                <button
                  onClick={() => setShowAddress(!showAddress)}
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer"
                >
                  Change
                </button>
              </div>

              <div className="relative">
                <div className="p-3 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {selectedAddress
                      ? `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}`
                      : "No address selected"}
                  </p>
                </div>

                {showAddress && (
                  <div className="absolute z-10 top-full left-0 right-0 mt-2 bg-white border border-gray-200 shadow-2xl rounded-xl overflow-hidden max-h-60 overflow-y-auto">
                    {address.map((item, index) => (
                      <div
                        key={index}
                        onClick={() => { setSelectedAddress(item); setShowAddress(false); }}
                        className="p-3 text-sm hover:bg-indigo-50 cursor-pointer border-b last:border-0 transition-colors"
                      >
                        {item.street}, {item.city}
                      </div>
                    ))}
                    <div
                      onClick={() => navigate("/add-address")}
                      className="p-3 text-sm text-center text-indigo-600 font-bold bg-indigo-50/50 hover:bg-indigo-50 cursor-pointer"
                    >
                      + Add New Address
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-6">
              <label className="text-sm font-bold text-gray-700 uppercase block mb-2">Payment Method</label>
              <select
                onChange={(e) => setPaymentOption(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="COD">Cash On Delivery</option>
                <option value="Online">Online Payment</option>
              </select>
            </div>

            <div className="space-y-3 border-t pt-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>৳{totalCartAmount().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (2%)</span>
                <span>৳{((totalCartAmount() * 2) / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t">
                <span>Total</span>
                <span>৳{(totalCartAmount() + (totalCartAmount() * 2) / 100).toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={placeOrder}
              className="w-full mt-8 bg-black hover:bg-gray-800 text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-[0.98] cursor-pointer"
            >
              {paymentOption === "COD" ? "Place Order" : "Proceed to Payment"}
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center py-24 px-4">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-800">Your cart is empty</h2>
      <p className="text-gray-500 mt-2">Looks like you haven't added anything yet.</p>
      <button onClick={() => navigate("/products")} className="mt-6 bg-indigo-600 text-white px-8 py-3 rounded-full font-semibold">Start Shopping</button>
    </div>
  );
};

export default Cart;