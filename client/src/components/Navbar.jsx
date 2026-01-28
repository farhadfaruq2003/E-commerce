import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const {
    user,
    setUser,
    setShowUserLogin,
    navigate,
    searchQuery,
    setSearchQuery,
    cartCount,
    axios,
  } = useAppContext();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logout = async () => {
    try {
      const { data } = await axios.get("/api/user/logout");
      if (data.success) {
        setUser(null);
        localStorage.removeItem("token");
        navigate("/");
        toast.success("Logged out successfully");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      navigate("/products");
    }
  }, [searchQuery, navigate]);

  return (
    <nav className={`sticky top-0 z-[100] transition-all duration-500 ${
      isScrolled 
      ? "py-3 bg-white/80 backdrop-blur-2xl border-b border-indigo-100 shadow-[0_10px_30px_rgba(79,70,229,0.1)]" 
      : "py-6 bg-transparent"
    }`}>
      <div className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32">
        
        {/* Logo Section with Gradient */}
        <Link to="/" className="group flex flex-col">
          <h2 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent tracking-tighter group-hover:scale-105 transition-transform duration-300">
            দুঃস্বপ্ন
          </h2>
          <span className="text-[10px] md:text-xs font-bold text-indigo-400 -mt-1 uppercase tracking-widest opacity-90">
            কষ্টের টাকায় শ্রেষ্ঠ বাজার
          </span>
        </Link>

        {/* Colorful Fancy Navigation Links */}
        <div className="hidden sm:flex items-center gap-10">
          {[
            { name: "Home", path: "/" },
            { name: "All Products", path: "/products" }
          ].map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) => `
                relative text-sm font-black uppercase tracking-wider transition-all duration-300
                ${isActive ? "text-indigo-600 scale-110" : "text-gray-600 hover:text-purple-500"}
                group
              `}
            >
              {link.name}
              {/* Animated Colorful Underline */}
              <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-full`}></span>
              {window.location.pathname === link.path && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-600 to-pink-500 transition-all duration-500"></span>
              )}
            </NavLink>
          ))}
        </div>

        {/* Right Section: Actions */}
        <div className="flex items-center gap-3 md:gap-6">
          
          {/* Search - Glassy & Colorful Focus */}
          <div className="hidden lg:flex items-center bg-white/50 backdrop-blur-sm px-4 py-2 rounded-2xl border border-indigo-100 focus-within:border-purple-400 focus-within:ring-4 focus-within:ring-purple-100 transition-all w-48 xl:w-64 shadow-sm">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none text-xs w-full font-bold text-gray-700 placeholder-indigo-300"
              type="text"
              placeholder="Search anything..."
            />
            <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>

          {/* Cart Icon - Neon Indigo Glow */}
          <div 
            onClick={() => navigate("/cart")} 
            className="relative cursor-pointer p-2.5 bg-gradient-to-br from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 rounded-xl transition-all active:scale-90 shadow-inner group"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="url(#gradient-id)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <defs>
                <linearGradient id="gradient-id" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4F46E5" />
                  <stop offset="100%" stopColor="#D946EF" />
                </linearGradient>
              </defs>
              <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <span className="absolute -top-1.5 -right-1.5 text-[10px] font-black text-white bg-gradient-to-r from-pink-500 to-orange-500 w-5 h-5 flex items-center justify-center rounded-lg shadow-[0_4px_10px_rgba(236,72,153,0.4)] animate-bounce">
              {cartCount()}
            </span>
          </div>

          {/* User Auth with Colorful Border */}
          <div className="hidden sm:block">
            {user ? (
              <div className="relative group">
                <div className="p-[2px] rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 group-hover:rotate-180 transition-transform duration-500">
                  <div className="bg-white p-0.5 rounded-full">
                    <img src={user.image || assets.profile_icon} alt="profile" className="w-9 h-9 rounded-full cursor-pointer object-cover" />
                  </div>
                </div>
                {/* Profile Dropdown */}
                <div className="absolute right-0 top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <ul className="bg-white/90 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white py-2 w-48 rounded-2xl text-sm font-bold text-gray-700">
                    <li onClick={() => navigate("/my-orders")} className="px-5 py-3 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 hover:text-white cursor-pointer transition-all mx-2 rounded-xl">My Orders</li>
                    <li onClick={() => navigate("/my-profile")} className="px-5 py-3 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 hover:text-white cursor-pointer transition-all mx-2 rounded-xl">My Profile</li>
                    {user.isSeller && (
                      <li onClick={() => navigate("/seller")} className="px-5 py-3 hover:bg-gradient-to-r hover:from-green-500 hover:to-emerald-600 hover:text-white cursor-pointer transition-all mx-2 rounded-xl">🏪 My Shop</li>
                    )}
                    <hr className="my-2 border-indigo-50" />
                    <li onClick={logout} className="px-5 py-3 hover:bg-red-500 hover:text-white text-red-500 cursor-pointer transition-all mx-2 rounded-xl">Logout</li>
                  </ul>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowUserLogin(true)}
                className="relative overflow-hidden group px-8 py-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-sm font-black rounded-xl hover:shadow-[0_15px_30px_rgba(124,58,237,0.4)] transition-all active:scale-95"
              >
                <span className="relative z-10">LOGIN</span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </button>
            )}
          </div>

          {/* Mobile Toggle Button */}
          <button onClick={() => setOpen(!open)} className="sm:hidden p-2.5 bg-gradient-to-tr from-indigo-50 to-purple-50 rounded-xl">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path></svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer - Very Colorful */}
      <div className={`sm:hidden fixed inset-x-0 top-[85px] p-4 transition-all duration-500 ${open ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0 pointer-events-none"}`}>
        <div className="bg-white/90 backdrop-blur-3xl border border-indigo-50 rounded-[2rem] shadow-2xl p-8 flex flex-col gap-6">
          <Link onClick={() => setOpen(false)} to="/" className="text-xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent pb-2 border-b border-indigo-50">Home</Link>
          <Link onClick={() => setOpen(false)} to="/products" className="text-xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent pb-2 border-b border-indigo-50">All Products</Link>
          {user ? (
            <button onClick={logout} className="text-left text-red-500 font-black text-xl">Logout</button>
          ) : (
            <button onClick={() => { setShowUserLogin(true); setOpen(false); }} className="w-full py-5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-2xl font-black text-lg shadow-xl">Login</button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;