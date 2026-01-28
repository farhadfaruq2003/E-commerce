import React, { useContext, useEffect } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Address = () => {
  const [address, setAddress] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: "",
  });

  const { axios, user, navigate } = useContext(AppContext);

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const submitHanlder = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/address/add", { address });
      if (data.success) {
        toast.success(data.message);
        navigate("/cart");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/cart");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-[#fcfcfc] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Shipping Address</h1>
          <p className="mt-2 text-gray-500">Please enter the details where you want your products delivered.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Left Side: Professional Form */}
          <div className="w-full lg:w-3/5 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <form onSubmit={submitHanlder} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="John"
                    value={address.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Doe"
                    value={address.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="example@mail.com"
                  value={address.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Street Address</label>
                <input
                  type="text"
                  name="street"
                  placeholder="House no, Street name, Area"
                  value={address.street}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                <div className="col-span-1 md:col-span-2 flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    name="city"
                    value={address.city}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">State</label>
                  <input
                    type="text"
                    name="state"
                    value={address.state}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">Zip Code</label>
                  <input
                    type="number"
                    name="zipCode"
                    value={address.zipCode}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={address.country}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="number"
                    name="phone"
                    placeholder="+880"
                    value={address.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 bg-black hover:bg-gray-800 text-white font-semibold py-3.5 rounded-lg transition-all shadow-lg active:scale-[0.98]"
              >
                Deliver to this Address
              </button>
            </form>
          </div>

          {/* Right Side: Visual Element */}
          <div className="hidden lg:flex w-2/5 flex-col items-center justify-center sticky top-10">
            <div className="relative group">
               <div className="absolute -inset-1 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
               <img
                src={assets.add_address_iamge}
                alt="Address Illustration"
                className="relative w-full max-w-sm rounded-2xl transition-transform duration-500 hover:scale-105"
              />
            </div>
            <div className="mt-8 text-center px-6">
               <h3 className="text-lg font-medium text-gray-800">Fast & Secure Delivery</h3>
               <p className="text-sm text-gray-500 mt-2">Your information is encrypted and securely stored for your future orders.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Address;