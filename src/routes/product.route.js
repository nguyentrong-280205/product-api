const express = require("express");

const {
  getProducts,
  getProductByPid,
  createProduct,
  updateProduct,
  deleteProduct
} = require("../controllers/product.controller");

const router = express.Router();

router.get("/", getProducts);

router.get("/:pid", getProductByPid);

router.post("/", createProduct);

router.put("/:pid", updateProduct);

router.delete("/:pid", deleteProduct);

module.exports = router;