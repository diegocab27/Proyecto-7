import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        const fetchCart = async () => {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/cart/get-cart', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            setCart(data.cart);
            calculateTotalPrice(data.cart.products);
        };

        fetchCart();
    }, []);

    const calculateTotalPrice = (products) => {
        const total = products.reduce((acc, product) => acc + product.price, 0);
        setTotalPrice(total);
    };

    const handlePayment = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/payment/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ totalPrice }), // Asegúrate de que `totalPrice` tenga el valor correcto
            });
    
            if (!response.ok) {
                throw new Error('Error al crear la orden de PayPal');
            }
    
            const data = await response.json();
            // Aquí puedes redirigir al usuario a PayPal usando el enlace recibido
            window.location.href = data.links[1].href; // Asumiendo que el segundo link es el que redirige a PayPal
        } catch (error) {
            console.error('Error al procesar el pago:', error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Detalle</h1>
        {cart ? (
            <>
                <ul className="space-y-4">
                    {cart.products.map((product, index) => (
                        <li key={index} className="flex justify-between items-center p-4 border-b border-gray-200">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-700">{product.name}</h2>
                                <p className="text-gray-500">Precio: ${product.price.toFixed(2)}</p>
                            </div>
                            <span className="text-lg font-bold text-gray-800">${product.price.toFixed(2)}</span>
                        </li>
                    ))}
                </ul>
                <div className="mt-6 flex justify-between items-center border-t border-gray-200 pt-4">
                    <h2 className="text-2xl font-bold text-gray-800">Total:</h2>
                    <span className="text-2xl font-bold text-green-600">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="mt-8">
                    <button 
                        onClick={handlePayment} 
                        className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-300"
                    >
                        Pagar
                    </button>
                </div>
            </>
        ) : (
            <p className="text-center text-gray-500">Cargando carrito...</p>
        )}
    </div>
    );
};

export default Checkout;
