import { useAuth } from '../Components/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import Spinner from '../Components/Spinner'; // Asegúrate de ajustar la ruta
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { CustomToast } from '@/Components/CustomToast';

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Estado para controlar la visibilidad de la contraseña
  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Correo electrónico inválido')
        .required('El correo es requerido'),
      password: Yup.string()
        .min(6, 'La contraseña debe tener al menos 6 caracteres')
        .required('La contraseña es requerida')
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setIsLoading(true);
        await login(values.email, values.password);
        setIsLoading(false);
        navigate('/');
      } catch (error) {
        setIsLoading(false);
        console.error('Error de inicio de sesión', error);
        if (error instanceof Error) {
          // Muestra el mensaje del error en la alerta
          CustomToast({ message: `Error al iniciar sesión: ${error.message}`, type: 'error' });
        } else {
          CustomToast({ message: 'Ocurrió un error inesperado. Intenta de nuevo.', type: 'error' });
        }
      } finally {
        setSubmitting(false);
      }
    }
  });

  // const goToSignUp = () => {
  //   navigate('/sign-up');
  // };

  return (
    <div className='flex w-full h-screen'>
      <div className='w-full flex items-center justify-center lg:w-1/2'>
        <div className='font-inter bg-customGray px-10 py-20 rounded-3xl border-2 border-gray-200'>
          <h1 className='text-5xl font-semibold text-customGreen'>¡Bienvenido al sistema!</h1>
          <p className='font-medium text-lg text-gray-50 mt-4'>Por favor, ingresa con tus credenciales.</p>
          <form onSubmit={formik.handleSubmit} className='mt-8'>
            <div>
              <label className='text-lg font-medium text-white'>Correo</label>
              <input
                className='w-full border-2 border-black rounded-xl p-4 mt-1 bg-white'
                placeholder='Ingresa tu correo electrónico'
                type='email'
                autoComplete="username" 
                {...formik.getFieldProps('email')}
              />
              {formik.touched.email && formik.errors.email ? (
                <div className='text-red-500'>{formik.errors.email}</div>
              ) : null}
            </div>
            <div className='relative'>
              <label className='text-lg font-medium text-white'>Contraseña</label>
              <input
                className="w-full border-2 border-black rounded-xl p-4 mt-1 bg-white pr-10"
                placeholder="************"
                type={showPassword ? "text" : "password"} // Cambia el tipo según el estado
                autoComplete="current-password" // Atributo añadido para resolver el error
                {...formik.getFieldProps("password")}
              />
              <span
                onClick={() => setShowPassword(!showPassword)} // Cambia el estado al hacer clic
                className='absolute right-4 top-[62px] transform -translate-y-1/2 cursor-pointer text-gray-600'
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className='text-customGray' />
              </span>
              {formik.touched.password && formik.errors.password ? (
                <div className='text-red-500'>{formik.errors.password}</div>
              ) : null}
            </div>
            <div className='mt-8 flex flex-col gap-y-4'>
              <button
                type='submit'
                className='flex justify-center items-center active:scale-[.98] active:duration-75 hover:scale-[1.01] ease-in-out transition-all py-3 rounded-full bg-customGreen text-lg font-bold '
                disabled={formik.isSubmitting}
              >
                {isLoading ? (
                  <Spinner />
                ) : (
                  "Iniciar Sesión"
                )}

              </button>
              {/* <button
                type='button'
                className='flex py-3 rounded-full border-2 border-gray-200 items-center justify-center active:scale-[.98] active:duration-75 hover:scale-[1.01] ease-in-out transition-all text-white'
                onClick={goToSignUp}
              >
                Registrarse
              </button> */}
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

export default LoginForm;
