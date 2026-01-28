import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

// Add a request interceptor
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // If we get 401 or 403, the token is invalid/expired
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      const token = localStorage.getItem("token");
      if (token) {
        // Token exists but is invalid - clear it
        localStorage.removeItem("token");
        console.log("Token expired or invalid - cleared from storage");
      }
    }
    return Promise.reject(error);
  }
);

export const AppContext = createContext(null);

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // check seller status
  const fetchSeller = async () => {
    try {
      const { data } = await axios.get("/api/seller/is-auth");
      if (data.success) {
        setIsSeller(true);
      } else {
        setIsSeller(false);
      }
    } catch (error) {
      // Silently fail - user is not authenticated as seller
      setIsSeller(false);
      console.log("Not authenticated as seller");
    }
  };

  // fetch user auth status ,user Data and cart items
  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/is-auth");
      if (data.success) {
        setUser(data.user);
        setCartItems(data.user.cart || {}); // safeguard
      } else {
        setUser(null);
      }
    } catch (error) {
      // Silently fail - user is not authenticated
      setUser(null);
      console.log("Not authenticated as user");
    }
  };

  // fetch products
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get("/api/product/list");
      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // add product to cart
  const addToCart = (itemId, quantity = 1) => {
    let cartData = structuredClone(cartItems || {}); // safeguard
    const productId = String(itemId);

    if (cartData[productId]) {
      cartData[productId] += quantity;
    } else {
      cartData[productId] = quantity;
    }

    setCartItems(cartData);
    toast.success("Added to cart");
  };

  // update cart item quantity
  const updateCartItem = (itemId, quantity) => {
    let cartData = structuredClone(cartItems || {});
    const productId = String(itemId);
    cartData[productId] = quantity;
    setCartItems(cartData);
    toast.success(`cart updated`);
  };

  // total cart items
  const cartCount = () => {
    let totalCount = 0;
    for (const item in cartItems) {
      totalCount += cartItems[item];
    }
    return totalCount;
  };

  // total cart amount (fixed with optional chaining)
  const totalCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      const itemInfo = products.find((product) => String(product._id) === String(itemId) || String(product.id) === String(itemId));
      if (cartItems[itemId] > 0) {
        totalAmount += cartItems[itemId] * (itemInfo?.offerPrice ?? 0);
      }
    }
    return Math.floor(totalAmount * 100) / 100;
  };

  // remove product from cart
  const removeFromCart = (itemId) => {
    let cartData = structuredClone(cartItems || {});
    const productId = String(itemId);
    if (cartData[productId]) {
      cartData[productId] -= 1;
      if (cartData[productId] === 0) {
        delete cartData[productId];
      }
      toast.success(`remove from cart`);
      setCartItems(cartData);
    }
  };

  useEffect(() => {
    fetchProducts(); // This is a public route
    const token = localStorage.getItem("token");
    if (token) {
      // Only fetch if token exists
      fetchSeller();
      fetchUser();
    } else {
      // No token - set initial unauthenticated state
      setIsLoading(false);
    }
  }, []);

  // update database cart items
  useEffect(() => {
    const updateCart = async () => {
      try {
        const { data } = await axios.post("/api/cart/update", { cartItems });
        if (!data.success) {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    if (user) {
      updateCart();
    }
  }, [cartItems]);

  // logout function
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsSeller(false);
    setCartItems({});
    toast.success("Logged out successfully");
  };

  const value = {
    navigate,
    user,
    setUser,
    isSeller,
    setIsSeller,
    showUserLogin,
    setShowUserLogin,
    products,
    cartItems,
    addToCart,
    updateCartItem,
    removeFromCart,
    searchQuery,
    setSearchQuery,
    cartCount,
    totalCartAmount,
    axios,
    fetchProducts,
    setCartItems,
    isLoading,
    logout,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
