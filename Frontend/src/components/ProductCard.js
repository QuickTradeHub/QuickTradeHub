import React from "react";

const ProductCard = ({ product }) => (
  <div className="bg-slate-100 p-2 rounded-lg shadow-lg hover:shadow-lg transition cursor-pointer">
    <img src={product.image} alt={product.title} className="w-full h-32 object-cover rounded" />
    <h3 className="text-sm font-semibold mt-2 truncate">{product.title}</h3>
    <p className="text-sm text-gray-600">${product.price}</p>

  </div>
);

export default ProductCard;
