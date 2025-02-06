const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true }, // Reference to Category
  price: { type: Number, required: true },
  discountPercentage: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  stock: { type: Number, default: 0 },
  condition:{type:String,default:"New"},
  tags: { type: [String], default: [] },
  brand: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  weight: { type: Number },
  dimensions: {
    width: { type: Number },
    height: { type: Number },
    depth: { type: Number }
  },
  warrantyInformation: { type: String },
  shippingInformation: { type: String },
  availabilityStatus: { type: String },
  returnPolicy: { type: String },
  minimumOrderQuantity: { type: Number, default: 1 },
  images: { type: [String], default: [] },
  thumbnail: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  reviews: [{
    userId: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }]  // Add this line to reference reviews
});

module.exports = mongoose.model("Product", productSchema);
