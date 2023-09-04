const express = require("express");
const {
  createProduct,
  ferchAllProducts,
  ferchProductById,
  updateProduct,
} = require("../controller/Product");

const router = express.Router();

router
  .post("/", createProduct)
  .get("/", ferchAllProducts)
  .get("/:id", ferchProductById)
  .patch("/:id",updateProduct)
exports.router = router;
