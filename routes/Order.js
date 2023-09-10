const express = require('express');
const { createOrder, fetchOrdersByUser, deleteOrder, updateOrder,ferchAllOrders } = require('../controller/Order');

const router = express.Router();
//  /orders is already added in base path
router.post('/', createOrder)
      .get('/user/:userId', fetchOrdersByUser)
      .delete('/:id', deleteOrder)
      .patch('/:id', updateOrder)
      .get('/',ferchAllOrders)


exports.router = router;      