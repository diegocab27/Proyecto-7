const Cart = require('../models/cart');
const Product = require('../models/products');
const User = require('../models/user');

createCart = async (req, res) => {
    try {
     
      const userID = req.user.id;
        
      const newCartData = { ...req.body, userId: userID,products: []};
  
      // Crea un nuevo carrito con los datos actualizados
      const newCart = await Cart.create(newCartData);
  
      res.json({message:"carrito creado", cart: newCart });
    } catch (error) {
      res.status(500).json({ msg: "Error al crear el carrito", error });
    }
  };

  getCart = async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ msg: "No autorizado" });
      }
     
      const userID = req.user.id;
      console.log(userID);
  
      const foundUser = await User.findOne({ _id: userID });
      console.log(foundUser);
  
      if (!foundUser) {
        return res.status(404).json({ msg: "Usuario no encontrado" });
      }
     
      const foundCarts = await Cart.find({ userId: foundUser._id }).sort({ createdAt: -1 });
      
     
      if (foundCarts.length === 0) {
        return res.status(404).json({ msg: "Carrito no encontrado" });
      }
   
      const latestCart = foundCarts[0];
  
      res.json({
        cart: latestCart,
      });
    } catch (error) {
      console.error("Error al obtener el carrito:", error);
      res.status(500).json({ msg: "Error al obtener el carrito", error });
    }
  };

  editCart = async (req, res) => {
    try {
      
      const userID = req.user.id;
  
     
      const foundCart = await Cart.findOne({ userId: userID }).sort({ createdAt: -1 });
      console.log(foundCart)
      
      if (!foundCart) {
        return res.status(404).json({ msg: "Carrito no encontrado" });
      }
  
      
      const { cart } = req.body

      if (!cart || cart.length === 0) {
        return res.status(400).json({ msg: "El carrito está vacío" });
    }
  
      
      foundCart.products.push({...cart}); 
  
     
      await foundCart.save();
  
      
      res.json({
        msg: "Tu carrito fue actualizado",
        updatedCart: foundCart,
      });
    } catch (error) {
      res.status(500).json({ msg: "Error al actualizar el carrito", error });
      console.log(error)
    }
  };

module.exports = {createCart,getCart,editCart};


  