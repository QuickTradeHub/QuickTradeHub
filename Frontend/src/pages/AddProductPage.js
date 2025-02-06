import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

const AddProductPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [images, setImages] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [categories, setCategories] = useState([]);

  // Fetch categories from the database
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:3000/categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Handle image selection
  const handleImageChange = (e) => {
    const selectedImages = Array.from(e.target.files);
    setImages(selectedImages);
  };

  // Handle thumbnail selection
  const handleThumbnailChange = (e) => {
    setThumbnail(e.target.files[0]);
  };

  // Handle form submission
  const onSubmit = async (data) => {
    // Include the category ID in the data object
    const productData = {
      ...data,
      categoryId: data.category, // Assuming category contains the category ID
      images: images, // Add the selected images
      thumbnail: thumbnail // Add the thumbnail image
    };

    console.log("Product Data:", productData);

    // Send the product data to your API
    try {
      const response = await fetch('/add-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      if (response.ok) {
        alert('Product added successfully');
      } else {
        alert('Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error adding product');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 rounded-lg shadow-xl mt-10">
      <h2 className="text-3xl font-extrabold text-white text-center mb-6">List Your Product</h2>

      <form onSubmit={handleSubmit(onSubmit)}>

        {/* Product Title */}
        <div className="mb-6">
          <label htmlFor="title" className="block text-lg font-medium text-white">Product Title</label>
          <input
            id="title"
            name="title"
            type="text"
            className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter product title"
            {...register("title", { required: "Product title is required" })}
          />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
        </div>

        {/* Product Description */}
        <div className="mb-6">
          <label htmlFor="description" className="block text-lg font-medium text-white">Description</label>
          <textarea
            id="description"
            name="description"
            rows="4"
            className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter product description"
            {...register("description", { required: "Description is required" })}
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
        </div>

        {/* Category Selection */}
        <div className="mb-6">
          <label htmlFor="category" className="block text-lg font-medium text-white">Category</label>
          <select
            id="category"
            name="category"
            className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("category", { required: "Category is required" })}
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
        </div>

        {/* Price */}
        <div className="mb-6">
          <label htmlFor="price" className="block text-lg font-medium text-white">Price</label>
          <input
            id="price"
            name="price"
            type="number"
            className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter product price"
            {...register("price", { required: "Price is required" })}
          />
          {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
        </div>

        {/* Stock */}
        <div className="mb-6">
          <label htmlFor="stock" className="block text-lg font-medium text-white">Stock</label>
          <input
            id="stock"
            name="stock"
            type="number"
            className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter stock quantity"
            {...register("stock", { required: "Stock quantity is required" })}
          />
          {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock.message}</p>}
        </div>

        {/* Brand */}
        <div className="mb-6">
          <label htmlFor="brand" className="block text-lg font-medium text-white">Brand</label>
          <input
            id="brand"
            name="brand"
            type="text"
            className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter product brand"
            {...register("brand", { required: "Brand is required" })}
          />
          {errors.brand && <p className="text-red-500 text-xs mt-1">{errors.brand.message}</p>}
        </div>

        {/* Condition */}
        <div className="mb-6">
          <label htmlFor="condition" className="block text-lg font-medium text-white">Condition</label>
          <select
            id="condition"
            name="condition"
            className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("condition", { required: "Condition is required" })}
          >
            <option value="">Select Condition</option>
            <option value="new">New</option>
            <option value="used">Used</option>
            <option value="refurbished">Refurbished</option>
          </select>
          {errors.condition && <p className="text-red-500 text-xs mt-1">{errors.condition.message}</p>}
        </div>

        {/* Shipping */}
        <div className="mb-6">
          <label htmlFor="shipping" className="block text-lg font-medium text-white">Shipping Options</label>
          <select
            id="shipping"
            name="shipping"
            className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("shipping", { required: "Shipping options are required" })}
          >
            <option value="">Select Shipping Method</option>
            <option value="free">Free Shipping</option>
            <option value="paid">Paid Shipping</option>
            <option value="local">Local Pickup</option>
          </select>
          {errors.shipping && <p className="text-red-500 text-xs mt-1">{errors.shipping.message}</p>}
        </div>

        {/* Tags */}
        <div className="mb-6">
          <label htmlFor="tags" className="block text-lg font-medium text-white">Tags (Optional)</label>
          <input
            id="tags"
            name="tags"
            type="text"
            className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter product tags, separated by commas"
            {...register("tags")}
          />
        </div>

        {/* Image Selection */}
        <div className="mb-6">
          <label htmlFor="images" className="block text-lg font-medium text-white">Product Images</label>
          <input
            id="images"
            name="images"
            type="file"
            className="mt-2 w-full p-3 border border-gray-300 rounded-lg"
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />
          {images.length > 0 && (
            <div className="mt-2 grid grid-cols-3 gap-2">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(img)}
                  alt={`Image ${index + 1}`}
                  className="w-24 h-24 object-cover rounded-lg shadow-md"
                />
              ))}
            </div>
          )}
        </div>

        {/* Thumbnail Selection */}
        <div className="mb-6">
          <label htmlFor="thumbnail" className="block text-lg font-medium text-white">Thumbnail Image</label>
          <input
            id="thumbnail"
            name="thumbnail"
            type="file"
            className="mt-2 w-full p-3 border border-gray-300 rounded-lg"
            accept="image/*"
            onChange={handleThumbnailChange}
          />
          {thumbnail && (
            <div className="mt-2">
              <img
                src={URL.createObjectURL(thumbnail)}
                alt="Thumbnail"
                className="w-32 h-32 object-cover rounded-lg shadow-md"
              />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-6 w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 shadow-lg transition-all"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProductPage;
