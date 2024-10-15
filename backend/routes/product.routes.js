const express = require("express");
const router = express.Router();

const { findAll, findOne, create, update, remove } = require("../controllers/product.controller");

router.post("/create", create);
router.get("/readall", findAll);
router.get("/readone/:id", findOne);
router.put("/update/:id", update);
router.delete("/delete/:id", remove);

module.exports = router;