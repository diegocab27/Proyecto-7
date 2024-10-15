const { application } = require('express');
const Cart = require('../models/cart');
require("dotenv").config();

const axios = require('axios')

const createOrder = async (req, res) => {
    try {
        const userID = req.user.id;

        // Obtén el carrito del usuario desde la base de datos
        const cart = await Cart.findOne({ userId: userID }).sort({ createdAt: -1 });

        if (!cart) {
            return res.status(404).json({ msg: "Carrito no encontrado" });
        }

        // Calcula el valor total
        const total = cart.products.reduce((acc, product) => acc + product.price, 0).toFixed(2);

        const order = {
            intent: 'CAPTURE',
            purchase_units: [
                {
                    amount: {
                        currency_code: "USD",
                        value: total,  // Valor calculado dinámicamente
                    }
                }
            ],
            application_context: {
                brand_name: "Mi Farmacia",
                landing_page: "NO_PREFERENCE",
                user_action: "PAY_NOW",
                return_url: `http://localhost:3000/capture-order`,
                cancel_url: `http://localhost:3000/cancel-order`
            }
        };

        // Obtener el token OAuth
        const params = new URLSearchParams();
        params.append('grant_type', 'client_credentials');

        const { data: { access_token } } = await axios.post(`${process.env.PAYPAL_API}/v1/oauth2/token`, params, {
            auth: {
                username: process.env.PAYPAL_API_CLIENT,
                password: process.env.PAYPAL_API_SECRET
            }
        });

        // Crear la orden en PayPal
        const response = await axios.post(`${process.env.PAYPAL_API}/v2/checkout/orders`, order, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });

        // Retornar la orden al cliente
        res.json({
            msg: 'Orden creada con éxito',
            orderID: response.data.id,
            links: response.data.links
        });
    } catch (error) {
        console.error('Error al crear la orden de PayPal:', error);
        res.status(500).json({ msg: 'Error al crear la orden de PayPal', error });
    }
};




const captureOrder = async (req, res) => {
    try {
        const { token } = req.query;  // El 'token' es el ID de la orden
        const { data } = await axios.post(`${PAYPAL_API}/v2/checkout/orders/${token}/capture`, {}, {
            auth: {
                username: PAYPAL_API_CLIENT,
                password: PAYPAL_API_SECRET
            }
        });

        console.log(data);  // Verifica la respuesta de PayPal en la consola

        // Retorna la información de la transacción capturada al frontend
        res.json({
            msg: 'Pago realizado con éxito',
            data,  // Información completa de la transacción
        });
    } catch (error) {
        console.error('Error al capturar el pago:', error);
        res.status(500).json({ msg: 'Error al capturar el pago', error });
    }
};



const cancelPayment = async (req, res) => {





 }


module.exports = { createOrder, captureOrder, cancelPayment }