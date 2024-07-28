import { useAuth } from '../Components/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'sonner';

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

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
        await login(values.email, values.password);
        navigate('/');
      } catch (error) {
        console.error('Error de inicio de sesión', error);
        toast.error(`Error al iniciar sesión: ${error}`);
      } finally {
        setSubmitting(false);
      }
    }
  });

  const goToSignUp = () => {
    navigate('/sign-up');
  };

  return (
    <div className='flex w-full h-screen'>
      <div className='w-full flex items-center justify-center lg:w-1/2'>
        <div className='font-inter bg-customGray px-10 py-20 rounded-3xl border-2 border-gray-200'>
          <h1 className='text-5xl font-semibold text-customGreen'>¡Bienvenido de nuevo!</h1>
          <p className='font-medium text-lg text-gray-50 mt-4'>Por favor, ingresa con tus credenciales.</p>
          <form onSubmit={formik.handleSubmit} className='mt-8'>
            <div>
              <label className='text-lg font-medium text-white'>Correo</label>
              <input
                className='w-full border-2 border-black rounded-xl p-4 mt-1 bg-white'
                placeholder='Ingresa tu correo electrónico'
                type='email'
                {...formik.getFieldProps('email')}
              />
              {formik.touched.email && formik.errors.email ? (
                <div className='text-red-500'>{formik.errors.email}</div>
              ) : null}
            </div>
            <div>
              <label className='text-lg font-medium text-white'>Contraseña</label>
              <input
                className='w-full border-2 border-black rounded-xl p-4 mt-1 bg-white'
                placeholder='************'
                type='password'
                {...formik.getFieldProps('password')}
              />
              {formik.touched.password && formik.errors.password ? (
                <div className='text-red-500'>{formik.errors.password}</div>
              ) : null}
            </div>
            <div className='mt-8 flex flex-col gap-y-4'>
              <button
                type='submit'
                className='active:scale-[.98] active:duration-75 hover:scale-[1.01] ease-in-out transition-all py-3 rounded-full bg-customGreen text-lg font-bold'
                disabled={formik.isSubmitting}
              >
                Iniciar sesión
              </button>
              <button
                type='button'
                className='flex py-3 rounded-full border-2 border-gray-200 items-center justify-center active:scale-[.98] active:duration-75 hover:scale-[1.01] ease-in-out transition-all text-white'
                onClick={goToSignUp}
              >
                Registrarse
              </button>
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
