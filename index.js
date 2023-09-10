const express = require("express");
const mongoose = require("mongoose");
const { createProduct } = require("./controller/Product");
const productRouter = require("./routes/Products");
const categoryRouter = require('./routes/Category');
const brandRouter = require('./routes/Brand');
const userRouter = require('./routes/User')
const cors = require('cors');
const authRouter = require('./routes/Auth');
const cartRouter = require('./routes/Cart')
const orderRouter = require('./routes/Order')


const server = express();

server.use(cors({exposedHeaders:['X-Total-Count']}));
server.use(express.json());
server.use('/products',productRouter.router);
server.use('/categories',categoryRouter.router);
server.use('/brands',brandRouter.router);
server.use('/user',userRouter.router);
server.use('/auth',authRouter.router);
server.use('/cart',cartRouter.router);
server.use('/orders',orderRouter.router);

main().catch(err=> console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce');
    console.log('database connected..')
}

server.listen(8080, () => {
  console.log("server started..");
});
