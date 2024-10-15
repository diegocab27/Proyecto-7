const express = require("express");
const router = express.Router();
const auth = require ('../middleware/authorization');

const userRouter = require('./user.routes.js');
const productRouter = require('./product.routes');
const cartRouter = require('./cart.routes.js');
const paymentRouter = require('./payment.routes.js');




router.use('/user',userRouter);
router.use('/product',productRouter);
router.use('/cart',cartRouter);
router.use('/payment,',paymentRouter);




module.exports=router;