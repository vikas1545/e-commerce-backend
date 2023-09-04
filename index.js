const express = require("express");
const mongoose = require("mongoose");
const { createProduct } = require("./controller/Product");
const productRouters = require("./routes/Products");
const categoryRouters = require('./routes/Category');
const brandRouters = require('./routes/Brand');


const server = express();

server.use(express.json());

server.use('/products',productRouters.router);
server.use('/categories',categoryRouters.router);
server.use('/brands',brandRouters.router)

main().catch(err=> console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce');
    console.log('database connected..')
}

server.listen(8080, () => {
  console.log("server started..");
});
