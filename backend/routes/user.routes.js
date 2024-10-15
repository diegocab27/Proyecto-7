const express = require("express");
const router = express.Router();

const {create,login,verifyToken,update} = require("../controllers/user.controller");
const auth = require ('../middleware/authorization');


router.post('/signup',create);
router.post('/login',login);
router.get('/verifytoken',auth,verifyToken);
router.put('/update',auth,update);


module.exports = router;
