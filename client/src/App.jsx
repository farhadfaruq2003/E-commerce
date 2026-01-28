import { Routes, Route, useLocation } from "react-router-dom";
import Products from "./pages/Products";
import SingleProduct from "./pages/SingleProduct";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer";
import { useAppContext } from "./context/AppContext";
import Auth from "./modals/Auth";
import ProductCategory from "./pages/ProductCategory";
import Address from "./pages/Address";
import MyOrders from "./pages/MyOrders";
import Profile from "./pages/Profile";
import SellerLogin from "./components/seller/SellerLogin";
import SellerLayout from "./pages/seller/SellerLayout";
import AddProduct from "./pages/seller/AddProduct";
import ProductList from "./pages/seller/ProductList";
import Orders from "./pages/seller/Orders";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProductManagement from "./pages/admin/ProductManagement";
import OrderManagement from "./pages/admin/OrderManagement";
import UserList from "./pages/admin/UserList";
import Sellers from "./pages/admin/Sellers";

const App = () => {
  const isSellerPath = useLocation().pathname.includes("seller");
  const isAdminPath = useLocation().pathname.includes("admin");
  const { showUserLogin, isSeller } = useAppContext();

  return (
    <div className="text-default min-h-screen relative bg-[#F8FAFF] overflow-x-hidden">
      
      {/* 🌈 Background Fancy Blobs (Only for User Pages) */}
      {!isSellerPath && !isAdminPath && (
        <div className="fixed inset-0 z-0 pointer-events-none">
          {/* Top Left Blob */}
          <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-indigo-200/40 rounded-full blur-[120px] animate-pulse"></div>
          {/* Bottom Right Blob */}
          <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-purple-200/30 rounded-full blur-[150px]"></div>
          {/* Middle Floating Blob */}
          <div className="absolute top-[30%] right-[10%] w-[300px] h-[300px] bg-pink-100/40 rounded-full blur-[100px] animate-bounce duration-[10s]"></div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {isSellerPath || isAdminPath ? null : <Navbar />}
        {showUserLogin ? <Auth /> : null}
        <Toaster position="top-center" reverseOrder={false} />

        <main className={`flex-1 ${isSellerPath || isAdminPath ? "" : "px-6 md:px-16 lg:px-24 xl:px-32 py-6"}`}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:category" element={<ProductCategory />} />
            <Route path="/product/:category/:id" element={<SingleProduct />} />
            <Route path="/product/:id" element={<SingleProduct />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/add-address" element={<Address />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/my-profile" element={<Profile />} />
            
            {/* Seller Routes */}
            <Route path="/seller" element={<SellerLayout />}>
              <Route index element={isSeller ? <AddProduct /> : <SellerLogin />} />
              <Route
                path="product-list"
                element={isSeller ? <ProductList /> : <SellerLogin />}
              />
              <Route
                path="orders"
                element={isSeller ? <Orders /> : <SellerLogin />}
              />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<ProductManagement />} />
              <Route path="orders" element={<OrderManagement />} />
              <Route path="users" element={<UserList />} />
              <Route path="sellers" element={<Sellers />} />
            </Route>
          </Routes>
        </main>

        {isSellerPath || isAdminPath ? null : <Footer />}
      </div>
    </div>
  );
};

export default App;