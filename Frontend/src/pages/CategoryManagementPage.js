import React, { useState, useEffect } from "react";
import { Trash2, Edit2, PlusCircle } from "lucide-react";
import axios from "axios";

const CategoryManagementPage = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [editedCategoryName, setEditedCategoryName] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:3000/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleAddCategory = async () => {
    if (newCategory.trim() === "") {
      setErrorMessage("Category name cannot be empty.");
      return;
    }
    try {
      const response = await axios.post("http://localhost:3000/categories", {
        name: newCategory,
        description: newDescription,
      });
      setCategories([...categories, response.data]);
      setNewCategory("");
      setNewDescription("");
      setErrorMessage("");
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/categories/${id}`);
      setCategories(categories.filter((category) => category._id !== id));
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setEditedCategoryName(category.name);
    setEditedDescription(category.description);
  };

  const handleUpdateCategory = async () => {
    if (editedCategoryName.trim() === "") {
      setErrorMessage("Category name cannot be empty.");
      return;
    }
    try {
      const response = await axios.put(
        `http://localhost:3000/categories/${editingCategory._id}`,
        {
          name: editedCategoryName,
          description: editedDescription,
        }
      );
      setCategories(
        categories.map((cat) =>
          cat._id === editingCategory._id ? response.data : cat
        )
      );
      setEditingCategory(null);
      setEditedCategoryName("");
      setEditedDescription("");
      setErrorMessage("");
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Category Management</h1>

      <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
        <input
          type="text"
          className="border rounded-lg p-2 w-full"
          placeholder="New Category Name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <input
          type="text"
          className="border rounded-lg p-2 w-full"
          placeholder="New Category Description"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
        />
        <button
          onClick={handleAddCategory}
          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          <PlusCircle className="mr-2" /> Add Category
        </button>
      </div>

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div
            key={category._id}
            className="border rounded-lg p-4 shadow-md flex flex-col justify-between space-y-4"
          >
            {editingCategory && editingCategory._id === category._id ? (
              <div className="space-y-2">
                <input
                  type="text"
                  className="border rounded-lg p-2 w-full"
                  value={editedCategoryName}
                  onChange={(e) => setEditedCategoryName(e.target.value)}
                />
                <input
                  type="text"
                  className="border rounded-lg p-2 w-full"
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleUpdateCategory}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingCategory(null);
                      setErrorMessage("");
                    }}
                    className="bg-gray-400 text-white px-4 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <span className="text-lg font-medium">{category.name}</span>
                <p className="text-gray-600">{category.description}</p>
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={() => handleEditCategory(category)}
                    className="bg-blue-500 text-white p-2 rounded-lg"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category._id)}
                    className="bg-red-500 text-white p-2 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryManagementPage;
