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
    thumbnail: null,
    images: [],
  });

  useEffect(() => {
    axios
      .get(`http://13.49.132.61:3000/products/${productId}`)
      .then((res) => {
        setProduct(res.data);
      })
      .catch((err) => console.error("Error fetching product details:", err));
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
    setProduct((prev) => ({
      ...prev,
      thumbnail: file,
    }));
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

    axios
      .put(`http://13.49.132.61:3000/products/${productId}`, formData)
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
          <select
            name="category"
            value={product.category}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Category</option>
            {/* Add categories from the API */}
            <option value="categoryId">Category Name</option>
          </select>
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

        {/* Image Upload */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Product Images</label>
          <input
            type="file"
            name="images"
            multiple
            onChange={handleFileChange}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Thumbnail Upload */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Product Thumbnail</label>
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
