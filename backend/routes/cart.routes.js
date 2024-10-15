const express = require("express");
const router = express.Router();

const {createCart,getCart,editCart} = require("../controllers/cart.controller");
const auth = require ('../middleware/authorization');

router.post("/create-cart",auth, createCart);
router.get("/get-cart",auth, getCart);
router.put("/edit-cart",auth, editCart);


module.exports = router;