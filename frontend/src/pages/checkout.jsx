import { useEffect, useState } from "react";

const Checkout = () => {
    const [cart, setCart] = useState(null); 
    const [total, setTotal] = useState(0);  

    // Función para obtener el carrito desde el backend
    const fetchCart = async () => {
        try {
            const token = localStorage.getItem('token'); 
            const response = await fetch('http://localhost:3000/api/cart/get-cart', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, 
                },
            });

            if (!response.ok) {
                throw new Error('Error al obtener el carrito');
            }

            const data = await response.json();
            console.log(data.cart); 
            calculateTotal(data.cart.products); 
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    };

    
    const calculateTotal = (products) => {
        if (!products || Object.keys(products).length === 0) {
            console.error('No hay productos en el carrito');
            return;
        }
        
        
        const productArray = Object.values(products); 

        const totalAmount = productArray.reduce((sum, product) => {
            const price = Number(product.price); 
            if (isNaN(price)) {
                console.error(`Precio no es un número para el producto: ${JSON.stringify(product)}`);
                return sum; 
            }
            return sum + price; // Sumar el precio
        }, 0);

        setTotal(totalAmount);
    };

    useEffect(() => {
        fetchCart();  
    }, []);

    return (
        <div>
            <h1>Checkout</h1>
            {cart ? (
                <div>
                    <h2>Total: ${total}</h2>
                    <ul>
                        {Object.values(cart.products).map((product, index) => (  
                            <li key={index}>
                                <h3>{product.name}</h3>
                                <p>Precio: ${product.price}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>Cargando el carrito...</p>
            )}
        </div>
    );
};

export default Checkout;
