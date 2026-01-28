import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { getProductImage } from "../assets/assets";
import toast from "react-hot-toast";

const MyOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const { axios, user, navigate } = useAppContext();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchOrders = async (silent = false) => {
    try {
      if (!silent) setIsRefreshing(true);
      const { data } = await axios.get("/api/order/user");
      if (data.success) {
        setMyOrders(data.orders);
      } else {
        if (!silent) toast.error(data.message);
      }
    } catch (error) {
      if (!silent) toast.error(error.message);
    } finally {
      if (!silent) setIsRefreshing(false);
    }
  };

  const removeOrder = async (orderId) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    
    try {
      const { data } = await axios.delete(`/api/order/delete/${orderId}`);
      if (data.success) {
        toast.success("Order cancelled successfully");
        fetchOrders(); // Refresh the orders list
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel order");
    }
  };

  const removeOrderItem = async (orderId, itemIndex) => {
    if (!confirm("Are you sure you want to cancel this item?")) return;
    
    try {
      const { data } = await axios.delete(`/api/order/delete/${orderId}/item/${itemIndex}`);
      if (data.success) {
        toast.success(data.message);
        fetchOrders(); // Refresh the orders list
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel item");
    }
  };

  const viewProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
      
      // Set up polling to check for order status updates every 30 seconds
      const pollInterval = setInterval(() => {
        fetchOrders(true); // Silent refresh (no loading state or error toasts)
      }, 30000); // 30 seconds

      // Clean up interval on component unmount
      return () => clearInterval(pollInterval);
    }
  }, [user]);

  // স্ট্যাটাস অনুযায়ী কালার সেট করার ফাংশন
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'processing': return 'bg-blue-100 text-blue-700';
      case 'shipped': return 'bg-purple-100 text-purple-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-orange-100 text-orange-700';
    }
  };
  // Check if order was recently updated (within last 5 minutes)
  const isRecentlyUpdated = (updatedAt) => {
    if (!updatedAt) return false;
    const updateTime = new Date(updatedAt);
    const now = new Date();
    const diffInMinutes = (now - updateTime) / (1000 * 60);
    return diffInMinutes <= 5;
  };
  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Orders</h1>
              <p className="text-gray-500 mt-2">Check the status of your recent orders and manage returns.</p>
            </div>
            <button
              onClick={() => fetchOrders()}
              disabled={isRefreshing}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                isRefreshing 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm hover:shadow-md'
              }`}
            >
              <svg 
                className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {myOrders.length > 0 ? (
          <div className="space-y-8">
            {myOrders.map((order) => (
              <div
                key={order._id || order.id}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Order Meta Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex gap-8 text-sm">
                    <div>
                      <p className="text-gray-500 uppercase font-semibold text-[10px] tracking-widest">Order ID</p>
                      <p className="font-medium text-gray-900">#{String(order._id || order.id).slice(-8).toUpperCase()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 uppercase font-semibold text-[10px] tracking-widest">Date Placed</p>
                      <p className="font-medium text-gray-900">
                        {new Date(order.orderDate || order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 uppercase font-semibold text-[10px] tracking-widest">Total Amount</p>
                      <p className="font-bold text-indigo-600">৳{order.amount.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 bg-white border px-2 py-1 rounded capitalize font-medium">
                      {order.paymentType}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      {isRecentlyUpdated(order.updatedAt) && (
                        <span className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full animate-pulse">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Updated
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="divide-y divide-gray-100">
                  {order.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="p-6 flex flex-col md:flex-row md:items-center gap-6">
                      <div className="w-20 h-20 bg-gray-50 rounded-lg flex-shrink-0 border overflow-hidden">
                        <img
                          src={getProductImage(item.product.name) || `${import.meta.env.VITE_BACKEND_URL}/images/${Array.isArray(item.product.image) ? item.product.image[0] : item.product.image}`}
                          alt={item.product.name}
                          className="w-full h-full object-contain p-2"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 truncate">{item.product.name}</h3>
                        <p className="text-sm text-gray-500 mt-1 capitalize">{item.product.category}</p>
                        <div className="flex items-center gap-4 mt-3">
                          <p className="text-sm font-medium bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                            Qty: <span className="text-gray-900">{item.quantity || "1"}</span>
                          </p>
                          <p className="text-sm font-semibold text-gray-900">
                            ৳{(item.product.offerPrice * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className="flex md:flex-col gap-2">
                        <button 
                          onClick={() => viewProduct(item.product._id || item.product.id)}
                          className="flex-1 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                          View Product
                        </button>
                        <button 
                          onClick={() => removeOrderItem(order._id || order.id, itemIdx)}
                          disabled={order.status?.toLowerCase() !== 'order placed'}
                          className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                            order.status?.toLowerCase() !== 'order placed'
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-red-600 text-white hover:bg-red-700 shadow-sm cursor-pointer'
                          }`}
                          title={order.status?.toLowerCase() !== 'order placed' ? 'Cannot cancel - order has been updated' : 'Cancel this item'}
                        >
                          {order.status?.toLowerCase() === 'cancelled' ? 'Cancelled' : 'Cancel Item'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4 text-gray-400">
               <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900">No orders yet</h2>
            <p className="text-gray-500 mt-2 px-6">When you buy something, your order history will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;