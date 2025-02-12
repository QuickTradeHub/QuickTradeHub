import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FaImage, FaUpload } from "react-icons/fa";

const AddProductPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [images, setImages] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://quicktradehub.in/productservice/categories"
        );
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
    }
  };
  let user = JSON.parse(localStorage.getItem("user"));

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("price", data.price);
    formData.append("stock", data.stock);
    formData.append("brand", data.brand);
    formData.append("condition", data.condition);
    formData.append("shipping", data.shipping);
    formData.append("sellerId", user.userId);

    images.forEach((image) => {
      formData.append("images", image);
    });

    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }

    try {
      const response = await fetch(
        "https://quicktradehub.in/productservice/products",
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        alert("Product added successfully");
      } else {
        alert("Failed to add product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Error adding product");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-indigo-600 to-blue-500 flex justify-center items-center py-6 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-xl space-y-6 sm:p-10 sm:max-w-2xl">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          List Your Product
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          encType="multipart/form-data"
          className="space-y-6"
        >
          {/* Product Title */}
          <div className="mb-4">
            <label
              htmlFor="title"
              className="text-lg font-medium text-gray-700"
            >
              Product Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              className="mt-2 w-full p-4 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter product title"
              {...register("title", { required: "Product title is required" })}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-2">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Product Description */}
          <div className="mb-4">
            <label
              htmlFor="description"
              className="text-lg font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="4"
              className="mt-2 w-full p-4 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter product description"
              {...register("description", {
                required: "Description is required",
              })}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-2">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Category Selection */}
          <div className="mb-4">
            <label
              htmlFor="category"
              className="text-lg font-medium text-gray-700"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              className="mt-2 w-full p-4 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              {...register("category", { required: "Category is required" })}
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm mt-2">
                {errors.category.message}
              </p>
            )}
          </div>

          {/* Price */}
          <div className="mb-4">
            <label
              htmlFor="price"
              className="text-lg font-medium text-gray-700"
            >
              Price
            </label>
            <input
              id="price"
              name="price"
              type="number"
              className="mt-2 w-full p-4 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter product price"
              {...register("price", { required: "Price is required" })}
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-2">
                {errors.price.message}
              </p>
            )}
          </div>

          {/* Stock */}
          <div className="mb-4">
            <label
              htmlFor="stock"
              className="text-lg font-medium text-gray-700"
            >
              Stock
            </label>
            <input
              id="stock"
              name="stock"
              type="number"
              className="mt-2 w-full p-4 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter stock quantity"
              {...register("stock", { required: "Stock quantity is required" })}
            />
            {errors.stock && (
              <p className="text-red-500 text-sm mt-2">
                {errors.stock.message}
              </p>
            )}
          </div>

          {/* Brand */}
          <div className="mb-4">
            <label
              htmlFor="brand"
              className="text-lg font-medium text-gray-700"
            >
              Brand
            </label>
            <input
              id="brand"
              name="brand"
              type="text"
              className="mt-2 w-full p-4 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter product brand"
              {...register("brand", { required: "Brand is required" })}
            />
            {errors.brand && (
              <p className="text-red-500 text-sm mt-2">
                {errors.brand.message}
              </p>
            )}
          </div>

          {/* Condition */}
          <div className="mb-4">
            <label
              htmlFor="condition"
              className="text-lg font-medium text-gray-700"
            >
              Condition
            </label>
            <select
              id="condition"
              name="condition"
              className="mt-2 w-full p-4 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              {...register("condition", { required: "Condition is required" })}
            >
              <option value="">Select Condition</option>
              <option value="new">New</option>
              <option value="used">Used</option>
              <option value="refurbished">Refurbished</option>
            </select>
            {errors.condition && (
              <p className="text-red-500 text-sm mt-2">
                {errors.condition.message}
              </p>
            )}
          </div>

          {/* Shipping */}
          <div className="mb-4">
            <label
              htmlFor="shipping"
              className="text-lg font-medium text-gray-700"
            >
              Shipping Options
            </label>
            <select
              id="shipping"
              name="shipping"
              className="mt-2 w-full p-4 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              {...register("shipping", { required: "Shipping is required" })}
            >
              <option value="">Select Shipping Option</option>
              <option value="free">Free Shipping</option>
              <option value="paid">Paid Shipping</option>
            </select>
            {errors.shipping && (
              <p className="text-red-500 text-sm mt-2">
                {errors.shipping.message}
              </p>
            )}
          </div>

          {/* Image Upload */}
          <div className="mb-4">
            <label
              htmlFor="images"
              className="text-lg font-medium text-gray-700"
            >
              Product Images
            </label>
            <div className="relative mt-2">
              <input
                id="images"
                name="images"
                type="file"
                multiple
                className="w-full p-4 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onChange={handleImageChange}
              />
              <FaImage className="absolute right-3 top-3 text-gray-400" />
            </div>
          </div>

          {/* Thumbnail */}
          <div className="mb-4">
            <label
              htmlFor="thumbnail"
              className="text-lg font-medium text-gray-700"
            >
              Product Thumbnail
            </label>
            <div className="relative mt-2">
              <input
                id="thumbnail"
                name="thumbnail"
                type="file"
                className="w-full p-4 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onChange={handleThumbnailChange}
              />
              <FaUpload className="absolute right-3 top-3 text-gray-400" />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 transition duration-200"
          >
            Submit Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProductPage;
