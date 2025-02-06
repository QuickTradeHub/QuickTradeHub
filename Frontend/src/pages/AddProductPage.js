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
    setImages(Array.from(e.target.files));
  };

  // Handle thumbnail selection
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
    }
  };

  // Handle form submission
  const onSubmit = async (data) => {
    const formData = new FormData();

    // Append product data
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('sku', data.sku);
    formData.append('category', data.category);
    formData.append('price', data.price);
    formData.append('stock', data.stock);
    formData.append('brand', data.brand);
    formData.append('condition', data.condition);
    formData.append('shipping', data.shipping);

    // Append images
    images.forEach((image, index) => {
      formData.append('images', image);
    });
    

    // Append thumbnail
    if (thumbnail) {
      formData.append('thumbnail', thumbnail);
    }
    console.log(formData);
    // Send the form data to the API
    try {
      const response = await fetch('http://localhost:3000/products', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Product added successfully');
      } else {
        console.log(response)
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

      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
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

        {/* SKU */}
        <div className="mb-6">
          <label htmlFor="sku" className="block text-lg font-medium text-white">Product SKU</label>
          <input
            id="sku"
            name="sku"
            type="text"
            className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter product SKU"
            {...register("sku", { required: "Product SKU is required" })}
          />
          {errors.sku && <p className="text-red-500 text-xs mt-1">{errors.sku.message}</p>}
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
              <option key={category._id} value={category._id}>
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
            {...register("shipping", { required: "Shipping is required" })}
          >
            <option value="">Select Shipping Option</option>
            <option value="free">Free Shipping</option>
            <option value="paid">Paid Shipping</option>
          </select>
          {errors.shipping && <p className="text-red-500 text-xs mt-1">{errors.shipping.message}</p>}
        </div>

        {/* Image Upload */}
        <div className="mb-6">
          <label htmlFor="images" className="block text-lg font-medium text-white">Product Images</label>
          <input
            id="images"
            name="images"
            type="file"
            multiple
            className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleImageChange}
          />
        </div>

        {/* Thumbnail */}
        <div className="mb-6">
          <label htmlFor="thumbnail" className="block text-lg font-medium text-white">Product Thumbnail</label>
          <input
            id="thumbnail"
            name="thumbnail"
            type="file"
            className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleThumbnailChange}
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="w-full py-3 px-6 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
          Submit Product
        </button>
      </form>
    </div>
  );
};

export default AddProductPage;
