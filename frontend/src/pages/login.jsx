import { useState } from "react";
import { useNavigate } from "react-router-dom";


const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

  

    const handleLogin = async () => {
        const response = await fetch('http://localhost:3000/api/user/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'
                       
             },
            body: JSON.stringify({ username, password })
        },);

        if (response.ok) {
            const data = await response.json();
            const { token, name,_id } = data
            
            localStorage.setItem('token', token);
            localStorage.setItem('name', name)
            localStorage.setItem('id', _id);
            
            alert('Ingreso correcto');
            await createCart(_id);
            navigate('/profile')
            console.log(data)

            

        } else {
            alert('Usuario o contraseña incorrecto');
        }
    }

    const createCart = async (userID) => {
        const token = localStorage.getItem('token')
        const response = await fetch('http://localhost:3000/api/cart/create-cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ userID, products:[] }) // Cambiado para usar userID en lugar de _id
        });

        if (!response.ok) {
            alert('Error al crear el carrito'); // Manejo de errores
        } else {
            console.log('Carrito creado exitosamente'); // O puedes hacer algo más con la respuesta
        }
    };


    return (
        <>  
                <div className="my-6 gap-6 mb-6 md:grid-cols-2 bg-slate-500 p-8 w-60 ml-4 rounded-lg">
                
                <div className="mb-6 max-w-44">
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username o email</label>
                    <input type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Correo" value={username}
                        onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div className="mb-5 max-w-44">
                    <label htmlFor="password" className="block mb-3  text-sm font-medium text-gray-900 dark:text-white">Password</label>
                    <input type="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="•••••••••" value={password}
                        onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div className="flex items-start mb-6">
                    <div className="flex items-center h-5">
                        <input id="remember" type="checkbox" value="off" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800" required />
                    </div>
                    <label htmlFor="remember" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Acepto los <a href="#" className="text-blue-600 hover:underline dark:text-blue-500">terminos y condiciones</a>.</label>
                </div>
                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-44 px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={handleLogin}>Iniciar sesion</button>
                </div>
        </>
    );
};

export default Login;