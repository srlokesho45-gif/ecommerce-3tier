const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // allow frontend to access backend

// MongoDB connection
mongoose.connect("mongodb://mongo:27017/ecommerce", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected ✅"))
.catch(err => console.log("MongoDB connection error:", err));

// Product Model
const productSchema = new mongoose.Schema({
  name: String,
  price: Number
});

const Product = mongoose.model("Product", productSchema);

// Routes

// Root route
app.get("/", (req, res) => {
  res.send("E-commerce Backend Running ✅");
});

// Get all products
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new product
app.post("/api/products", async (req, res) => {
  try {
    const { name, price } = req.body;
    const product = new Product({ name, price });
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT} ✅`);
});
app.delete("/api/products/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
});
app.put("/api/products/:id", async (req, res) => {
  const updated = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});
