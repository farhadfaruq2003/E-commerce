import React, { useEffect } from "react";
import Banner from "../components/Banner";
import BestSeller from "../components/BestSeller";
import Category from "../components/Category";
import NewsLetter from "../components/NewsLetter";

const Home = () => {
  // পেজ লোড হলে একদম উপরে স্ক্রল করার জন্য (Professional UX)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-screen bg-white">
      {/* 1. Hero / Banner Section - Full width potentially inside component */}
      <section className="relative overflow-hidden">
        <Banner />
      </section>

      {/* Content Wrapper for consistency */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 2. Category Section - Strategic placement */}
        <section className="py-16 md:py-24 border-b border-gray-50">
          <div className="flex flex-col items-center mb-10 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              Shop by Category
            </h2>
            <div className="w-20 h-1 bg-indigo-500 mt-4 rounded-full"></div>
            <p className="mt-4 text-gray-500 max-w-xl">
              Explore our wide range of premium collections curated just for your lifestyle.
            </p>
          </div>
          <Category />
        </section>

        {/* 3. Best Seller Section - High Conversion Area */}
        <section className="py-16 md:py-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div className="text-left">
              <span className="text-indigo-600 font-semibold uppercase tracking-widest text-sm">
                Most Popular
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 tracking-tight">
                Our Best Sellers
              </h2>
            </div>
            <p className="text-gray-500 max-w-md md:text-right">
              Top-rated products loved by our customers worldwide. Quality meets perfection.
            </p>
          </div>
          <BestSeller />
        </section>

      </div>

      {/* 4. Newsletter Section - Full Width Background for visual break */}
      <section className="bg-gray-50 py-20 mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <NewsLetter />
        </div>
      </section>

      {/* Optional: Simple Trust Badges (Industry Standard for e-commerce) */}
      <div className="max-w-7xl mx-auto px-4 py-12 border-t border-gray-100">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center opacity-70">
          <div>
            <h4 className="font-bold text-gray-800">Free Shipping</h4>
            <p className="text-xs text-gray-500">On all orders above ৳5000</p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">Secure Payment</h4>
            <p className="text-xs text-gray-500">100% protected payments</p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">24/7 Support</h4>
            <p className="text-xs text-gray-500">Dedicated customer care</p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">Easy Returns</h4>
            <p className="text-xs text-gray-500">30-day money back guarantee</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;