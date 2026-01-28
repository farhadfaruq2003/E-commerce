import { assets, categories } from "../../assets/assets";
import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const AddProduct = () => {
  const { axios } = useContext(AppContext);
  const [files, setFiles] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("price", price);
      formData.append("offerPrice", offerPrice);

      for (let i = 0; i < files.length; i++) {
        if (files[i]) {
          formData.append("image", files[i]);
        }
      }

      const { data } = await axios.post("/api/product/add-product", formData);
      if (data.success) {
        toast.success(data.message);
        setName("");
        setDescription("");
        setCategory("");
        setPrice("");
        setOfferPrice("");
        setFiles([]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-4 md:p-10">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800">Add New Product</h2>
          <p className="text-sm text-gray-500">Upload product details and images for your inventory.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            
            {/* Left Side: Images */}
            <div className="space-y-6">
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-3">
                  Product Images <span className="text-gray-400 font-normal">(Up to 4)</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {Array(4).fill("").map((_, index) => (
                    <label 
                      key={index} 
                      htmlFor={`image${index}`}
                      className="group relative flex flex-col items-center justify-center h-32 w-full border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:bg-indigo-50 hover:border-indigo-300 transition-all"
                    >
                      <input
                        onChange={(e) => {
                          const updatedFiles = [...files];
                          updatedFiles[index] = e.target.files[0];
                          setFiles(updatedFiles);
                        }}
                        accept="image/*"
                        type="file"
                        id={`image${index}`}
                        hidden
                      />
                      {files[index] ? (
                        <img
                          className="h-full w-full object-cover rounded-lg"
                          src={URL.createObjectURL(files[index])}
                          alt="preview"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center space-y-1">
                          <img className="w-8 opacity-40 group-hover:opacity-70" src={assets.upload_area} alt="" />
                          <span className="text-xs text-gray-400 group-hover:text-indigo-500">Upload</span>
                        </div>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              <div className="hidden md:block p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                <p className="text-xs text-indigo-700 leading-relaxed">
                  <strong>Tip:</strong> Use high-quality JPG or PNG images with a 1:1 aspect ratio for the best display on the buyer's side.
                </p>
              </div>
            </div>

            {/* Right Side: Details */}
            <div className="space-y-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700" htmlFor="product-name">Product Title</label>
                <input
                  id="product-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Organic Brown Rice"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700" htmlFor="product-description">Description</label>
                <textarea
                  id="product-description"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm resize-none"
                  placeholder="Tell buyers about your product..."
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700" htmlFor="category">Category</label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white text-sm"
                    required
                  >
                    <option value="">Select</option>
                    {categories.map((item, index) => (
                      <option value={item.path} key={index}>{item.path}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                   {/* Empty space for grid alignment or another small field */}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700" htmlFor="product-price">Regular Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-400 text-sm">$</span>
                    <input
                      id="product-price"
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-7 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700" htmlFor="offer-price">Offer Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-400 text-sm">$</span>
                    <input
                      id="offer-price"
                      type="number"
                      value={offerPrice}
                      onChange={(e) => setOfferPrice(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-7 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full md:w-max px-12 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg shadow-indigo-200 transition-all active:scale-95"
                >
                  Confirm & Add Product
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;