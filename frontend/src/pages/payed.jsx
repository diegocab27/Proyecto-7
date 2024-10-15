const Payed = () => {

    return(
    <div className="my-6 max-w-md mx-auto bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg" role="alert">
      <div className="flex items-center">
        <svg className="w-6 h-6 mr-2 text-green-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
        </svg>
        <strong className="font-bold">¡Éxito!</strong>
      </div>
      <span className="block sm:inline mt-2">Pago realizado con éxito.</span>
    </div>
    
    )}
    
    
    export default Payed