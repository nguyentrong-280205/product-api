const express = require("express");
const mongoose = require("mongoose");

const productRoutes = require("./routes/product.route");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Product API is running"
  });
});

app.get("/health", (req, res) => {
  const mongoConnected =
    mongoose.connection.readyState === 1;

  if (!mongoConnected) {
    return res.status(503).json({
      status: "unhealthy",
      mongodb: "disconnected"
    });
  }

  res.status(200).json({
    status: "healthy",
    mongodb: "connected"
  });
});

app.use("/api/products", productRoutes);

module.exports = app;