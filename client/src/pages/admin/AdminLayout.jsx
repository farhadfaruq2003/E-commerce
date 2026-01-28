import { useContext, useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const AdminLayout = () => {
  const { user, logout } = useContext(AppContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    // Check if user is admin
    if (!user || user.role !== "ADMIN") {
      toast.error("Access denied. Admin only.");
      navigate("/");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user || user.role !== "ADMIN") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <div className="bg-indigo-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-sm text-indigo-200">Welcome, {user.name}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-white text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-64 bg-white rounded-lg shadow-md p-4 h-fit">
            <nav className="space-y-2">
              <Link
                to="/admin"
                onClick={() => setActiveTab("dashboard")}
                className={`block px-4 py-2 rounded-lg transition ${
                  activeTab === "dashboard"
                    ? "bg-indigo-600 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                📊 Dashboard
              </Link>
              <Link
                to="/admin/products"
                onClick={() => setActiveTab("products")}
                className={`block px-4 py-2 rounded-lg transition ${
                  activeTab === "products"
                    ? "bg-indigo-600 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                📦 Products
              </Link>
              <Link
                to="/admin/orders"
                onClick={() => setActiveTab("orders")}
                className={`block px-4 py-2 rounded-lg transition ${
                  activeTab === "orders"
                    ? "bg-indigo-600 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                🛒 Orders
              </Link>
              <Link
                to="/admin/users"
                onClick={() => setActiveTab("users")}
                className={`block px-4 py-2 rounded-lg transition ${
                  activeTab === "users"
                    ? "bg-indigo-600 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                👥 Users
              </Link>
              <Link
                to="/admin/sellers"
                onClick={() => setActiveTab("sellers")}
                className={`block px-4 py-2 rounded-lg transition ${
                  activeTab === "sellers"
                    ? "bg-indigo-600 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                🏪 Sellers
              </Link>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
