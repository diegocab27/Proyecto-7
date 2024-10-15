import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [totalProducts, setTotalProducts] = useState([]); // Estado para manejar el carrito

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    // Mueve la función fetchCart aquí
    const fetchCart = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:3000/api/cart/get-cart', { // Cambia esto a tu endpoint de obtener carrito
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Error al obtener el carrito');
            }

            const { cart } = await response.json();
            setTotalProducts(cart.products); // Asumiendo que `cart.products` contiene el array de productos
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/product/readall', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                if (!response.ok) {
                    throw new Error('Error en la solicitud');
                }

                const data = await response.json();
                setProducts(data.result);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
        fetchCart(); // Llama a la función para obtener el carrito
    }, []);

    const addToCart = async (name, price) => {
        const product = { name, price };
    
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/cart/edit-cart', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ name: product.name, price: product.price }), // Envía el producto directamente
            });
    
            if (!response.ok) {
                throw new Error('Error al agregar el producto al carrito');
            }
    
            console.log('Producto agregado al carrito:', product);
            // Re-fetch the cart to update the displayed cart items
            await fetchCart(); // Asegúrate de esperar a que se complete
        } catch (error) {
            console.error('Error al agregar el producto:', error);
        }
    };

    const handleCheckout = async () => {
        navigate('/checkout');
    };
    
    const name = localStorage.getItem('name') || 'Usuario';

    return (
        <>
            <div className="flex items-center justify-normal space-x-10 bg-zinc-700">
                <img className="w-56 select-none" src="https://res.cloudinary.com/dvikacg8b/image/upload/v1728609213/ivq6iodwmx5rhnf0b3eh.png" alt="logo" />
                <h1 className="text-5xl font-extrabold text-white">Hola {name}, bienvenido</h1>
            </div>

            <div className="flex">
                <div>
                    <h1 className="m-6 text-4xl font-extrabold dark:text-white">Lista de Productos</h1>
                    <ul className="grid-cols-1">
                        {products.map((product) => (
                            <li key={product._id} className="m-8 max-w-screen-md">
                                <div className="flex justify-normal bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                                    <a href="#">
                                        <img className="m-8 h-82 max-w-60 rounded-t-lg z md:rounded-none md:rounded-s-lg" src={product.image} />
                                    </a>
                                    <div className="m-4 w-auto">
                                        <a href="#">
                                            <h2 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">{product.name}</h2>
                                            <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">{product.description}</h5>
                                        </a>

                                        <div className="flex items-center justify-between space-x-3 bg-slate-400 my-10 p-4 rounded-lg">
                                            <span className="m-5 text-1xl font-bold text-gray-900 dark:text-white">Stock: {product.stock}</span>
                                            <span className="text-1xl font-bold text-gray-900 dark:text-white">Precio: ${product.price}</span>
                                            <button
                                                onClick={() => addToCart(product.name, product.price)}  // Ahora pasa nombre y precio
                                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                            >
                                                Agregar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="ml-10">
                    <h1 className="m-6 text-4xl font-extrabold dark:text-white">Carrito de Compras</h1>
                    {totalProducts.length > 0 ? (
                        <>
                            <ul className="grid-cols-1">
                                {totalProducts.map((item, index) => (
                                    <li key={index} className="m-8 max-w-screen-md">
                                        <div className="flex justify-normal bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                                            <div className="m-4 w-auto">
                                                <h2 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">{item.name}</h2>
                                                <span className="text-1xl font-bold text-gray-900 dark:text-white">Precio: ${item.price}</span>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={handleCheckout} // Llama a la función para procesar el pago
                                className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-500 dark:hover:bg-green-600 dark:focus:ring-green-800"
                            >
                                Ir a Pagar
                            </button>
                        </>
                    ) : (
                        <p className="text-lg text-gray-900 dark:text-white">El carrito está vacío</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default Profile;
