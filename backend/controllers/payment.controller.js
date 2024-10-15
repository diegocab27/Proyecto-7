const { application } = require('express');
const Cart = require('../models/cart');
require("dotenv").config();
const axios = require('axios');

const createOrder = async (req, res) => {
    const { totalPrice } = req.body; // Recibir el precio total de la compra

    const order = {
        intent: 'CAPTURE',
        purchase_units: [{
            amount: {
                currency_code: "USD",
                value: totalPrice.toString(), // Asegúrate de que sea un string
            }
        }],
        application_context: {
            brand_name: "Mi Farmacia",
            landing_page: "NO_PREFERENCE",
            user_action: "PAY_NOW",
        }
    };

    try {
        // Autenticación con PayPal
        const params = new URLSearchParams();
        params.append('grant_type', 'client_credentials');

        const { data: { access_token } } = await axios.post(`${process.env.PAYPAL_API}/v1/oauth2/token`, params, {
            auth: {
                username: process.env.PAYPAL_API_CLIENT,
                password: process.env.PAYPAL_API_SECRET
            }
        });

        // Crear la orden
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
    const { token } = req.query; // El 'token' es el ID de la orden

    try {
        const { data } = await axios.post(`${process.env.PAYPAL_API}/v2/checkout/orders/${token}/capture`, {}, {
            auth: {
                username: process.env.PAYPAL_API_CLIENT,
                password: process.env.PAYPAL_API_SECRET
            }
        });

        console.log(data); // Verifica la respuesta de PayPal en la consola

        // Retorna la información de la transacción capturada al frontend
        res.json({
            msg: 'Pago realizado con éxito',
            data, // Información completa de la transacción
        });
    } catch (error) {
        console.error('Error al capturar el pago:', error);
        res.status(500).json({ msg: 'Error al capturar el pago', error });
    }
};

const cancelPayment = async (req, res) => {
    // Lógica para cancelar el pago (puedes implementar según lo que necesites)
};

module.exports = { createOrder, captureOrder, cancelPayment };
