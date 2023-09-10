const express = require("express");
const {
  fetchCardByUser,
  addToCart,
  deleteFromCart,
  updateCart,
} = require("../controller/Cart");

const router = express.Router();

router
  .get("/", fetchCardByUser)
  .post("/", addToCart)
  .delete("/:id", deleteFromCart)
  .patch("/:id", updateCart);

exports.router = router;
