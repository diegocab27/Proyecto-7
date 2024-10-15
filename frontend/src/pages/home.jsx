import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Home() {
  const images = [
    'https://res.cloudinary.com/dvikacg8b/image/upload/v1728698468/hhd48h5zwdshaqutyt2u.png',
    'https://res.cloudinary.com/dvikacg8b/image/upload/v1728699026/a00fbpvmsggrcwvgmzft.png',
    'https://res.cloudinary.com/dvikacg8b/image/upload/v1728699651/ovihauf2c4mfhixoqbzc.webp',
  ];

  const Carousel = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Cambiar la imagen automáticamente cada 3 segundos
    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
      }, 3000); // Intervalo de 3 segundos

      return () => clearInterval(interval); // Limpiar el intervalo al desmontar
    }, [images.length]);

    const prevSlide = () => {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? images.length - 1 : prevIndex - 1
      );
    };

    const nextSlide = () => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    };

    return (
      <div className="relative max-w-screen-md  mx-auto mt-10">
        {/* Carousel content */}
        <div className="overflow-hidden relative">
          {images.map((image, index) => (
            <div
              key={index}
              className={`${
                index === currentIndex ? 'block' : 'hidden'
              } transition-all duration-300`}
            >
              <img src={image} alt={`Slide ${index}`} className="w-full rounded-lg" />
            </div>
          ))}
        </div>

        {/* Previous Button */}
        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full hover:bg-gray-800"
        >
          &lt;
        </button>

        {/* Next Button */}
        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full hover:bg-gray-800"
        >
          &gt;
        </button>

        {/* Dots for navigation */}
        <div className="flex justify-center mt-4">
          {images.map((_, index) => (
            <div
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 mx-2 rounded-full cursor-pointer ${
                currentIndex === index ? 'bg-gray-700' : 'bg-gray-400'
              }`}
            ></div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex max-h-40 items-center justify-between space-x-3 bg-zinc-700 py-4">
        <img
          className="w-56 select-none"
          src="https://res.cloudinary.com/dvikacg8b/image/upload/v1728609213/ivq6iodwmx5rhnf0b3eh.png"
          alt="logo"
        />
        <div>
          <Link to="/signup" className="rounded-2xl  bg-blue-500 text-white py-4 px-6 text-xl hover:bg-blue-600">
            Registrate
          </Link>

          <Link to="/login" className="rounded-2xl m-5 bg-blue-500 text-white py-4 px-6 text-xl hover:bg-blue-600">
            Iniciar sesión
          </Link>
        </div>
      </div>

      {/* Carousel */}
      <Carousel images={images} />
    </div>
  );
}

export default Home;