const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Asegúrate de tener un modelo User definido
        required: true
    },
    products:{type:Array,default:[]},
    
},{ timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;