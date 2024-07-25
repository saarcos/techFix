import  { useEffect, useState } from 'react';
import { useAuth } from '../Components/AuthProvider';
import { useNavigate } from 'react-router-dom';
const SignupForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await login(email, password);
      // Redirigir o actualizar el estado de la aplicación
    } catch (error) {
      console.error('Error de inicio de sesión', error);
      alert('Error de inicio de sesión');
    }
  };
  const goToLogIn=()=>{
    navigate('/login');
  }
  useEffect(() => {
    console.log(nombre);
  }, [nombre])
  

  return (
    <div className='flex w-full h-screen'>
        <div className='w-full flex items-center justify-center lg:w-1/2'>
          <div className='font-inter bg-customGray px-10 py-20 rounded-3xl border-2 border-gray-200'>
            <h1 className='text-5xl font-semibold text-customGreen'>¡Bienvenido!</h1>
            <p className='font-medium text-lg text-gray-50 mt-4'>Por favor, ingresa tu información para crear una cuenta</p>
            <form onSubmit={handleSubmit} className='mt-8'>
              <div>
                <label className='text-lg font-medium text-white'>Nombre</label>
                <input
                  className='w-full border-2 border-black rounded-xl p-4 mt-1 bg-white'
                  placeholder='Ingresa tu nombre'
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>
              <div>
                <label className='text-lg font-medium text-white'>Apellido</label>
                <input
                  className='w-full border-2 border-black rounded-xl p-4 mt-1 bg-white'
                  placeholder='Ingresa tu apellido'
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                />
              </div>
              <div>
                <label className='text-lg font-medium text-white'>Correo</label>
                <input
                  className='w-full border-2 border-black rounded-xl p-4 mt-1 bg-white'
                  placeholder='Ingresa tu correo electrónico'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className='text-lg font-medium text-white'>Contraseña</label>
                <input
                  className='w-full border-2 border-black rounded-xl p-4 mt-1 bg-white'
                  placeholder='************'
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className='mt-8 flex flex-col gap-y-4'>
                <button
                  type='submit' 
                  className='active:scale-[.98] active:duration-75 hover:scale-[1.01] ease-in-out transition-all py-3 rounded-full bg-customGreen text-lg font-bold'
                >
                  Registrarse
                </button>
              </div>
              <div className='flex flex-row justify-center items-center mt-4'>
                <p className='font-medium text-white'>¿Ya tienes una cuenta?</p>
                <button className='text-customGreen font-bold ml-2 text-base' onClick={goToLogIn}> Inicia Sesión </button>
              </div>

            </form>
          </div>  
        </div>
        <div className='hidden relative lg:flex h-full w-1/2 items-center justify-center bg-customGray'>
            <div className='w-60 h-60 bg-gradient-to-tr from-green-800 to-customGreen rounded-full animate-spin'></div>
            <div className='w-full h-1/2 absolute bg-customGray/10 bottom-0 backdrop-blur-lg'></div>
        </div>
    </div>
  );
};

export default SignupForm;
