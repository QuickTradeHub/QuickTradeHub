import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    image: "",
    stock: "",
    brand: "",
    condition: "",
    shipping: "",
    thumbnail: "",
    images: [],
  });
  const [categories, setCategories] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedThumbnail, setSelectedThumbnail] = useState(null);

  useEffect(() => {
    // Fetching product data by productId
    axios
      .get(`https://quicktradehub.in/productservice/products/${productId}`)
      .then((res) => {
        setProduct(res.data);
        setSelectedImages(res.data.images); // Setting existing image URLs
        setSelectedThumbnail(res.data.thumbnail); // Setting existing thumbnail URL
      })
      .catch((err) => console.error("Error fetching product details:", err));

    // Fetching categories for selection dropdown
    axios
      .get("https://quicktradehub.in/productservice/categories")
      .then((res) => {
        setCategories(res.data); // Assuming categories API returns an array of categories
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, [productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: Array.from(files),
    }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    setSelectedThumbnail(file);
  };

  const handleImageRemove = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleThumbnailRemove = () => {
    setSelectedThumbnail(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Append all the form fields to the formData
    Object.keys(product).forEach((key) => {
      if (Array.isArray(product[key])) {
        product[key].forEach((file) => formData.append(key, file));
      } else if (product[key]) {
        formData.append(key, product[key]);
      }
    });

    // Append images and thumbnail to form data
    selectedImages.forEach((image) => formData.append("images", image));
    if (selectedThumbnail) {
      formData.append("thumbnail", selectedThumbnail);
    }

    axios
      .put(`https://quicktradehub.in/productservice/products/${productId}`, formData)
      .then(() => navigate("/seller/products"))
      .catch((err) => console.error("Error updating product:", err));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">Edit Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product Title */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={product.title}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Product Description */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Description</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        {/* Price */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Price</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Category</label>
          <div className="relative">
            <select
              name="category"
              value={product.category}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
            <div
              className="absolute top-0 right-0 cursor-pointer text-red-500"
              onClick={() => setProduct((prev) => ({ ...prev, category: "" }))}
            >
              &#x2715;
            </div>
          </div>
        </div>

        {/* Stock */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Stock</label>
          <input
            type="number"
            name="stock"
            value={product.stock}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Brand */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Brand</label>
          <input
            type="text"
            name="brand"
            value={product.brand}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Condition */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Condition</label>
          <select
            name="condition"
            value={product.condition}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="new">New</option>
            <option value="used">Used</option>
            <option value="refurbished">Refurbished</option>
          </select>
        </div>

        {/* Shipping */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Shipping</label>
          <select
            name="shipping"
            value={product.shipping}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="free">Free Shipping</option>
            <option value="paid">Paid Shipping</option>
          </select>
        </div>

        {/* Displaying and Removing Images */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Product Images</label>
          <div className="flex flex-wrap gap-4">
            {selectedImages.length > 0 &&
              selectedImages.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`product image ${index + 1}`}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <span
                    className="absolute top-0 right-0 text-red-500 cursor-pointer"
                    onClick={() => handleImageRemove(index)}
                  >
                    &#10005;
                  </span>
                </div>
              ))}
            <input
              type="file"
              name="images"
              multiple
              onChange={handleFileChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Displaying and Removing Thumbnail */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Product Thumbnail</label>
          {selectedThumbnail && (
            <div className="relative">
              <img
                src={selectedThumbnail}
                alt="product thumbnail"
                className="w-24 h-24 object-cover rounded-lg"
              />
              <span
                className="absolute top-0 right-0 text-red-500 cursor-pointer"
                onClick={handleThumbnailRemove}
              >
                &#10005;
              </span>
            </div>
          )}
          <input
            type="file"
            name="thumbnail"
            onChange={handleThumbnailChange}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit Button */}
        <div className="mt-4">
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none"
          >
            Update Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
