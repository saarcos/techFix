import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {toast} from 'sonner'

const SignupForm = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      nombre: '',
      apellido: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Correo electrónico inválido')
        .required('El correo es obligatorio'),
      password: Yup.string()
        .min(6, 'La contraseña debe tener al menos 6 caracteres')
        .required('La contraseña es obligatoria'),
      nombre: Yup.string()
        .required('El nombre es obligatorio'),
      apellido: Yup.string()
        .required('El apellido es obligatorio'),
    }),
    onSubmit: async (values) => {
      try {
        console.log('Valores enviados:', values); // Agrega esta línea para depuración
        const response = await axios.post('http://localhost:3000/api/usuarios', {
          nombre: values.nombre,
          apellido: values.apellido,
          email: values.email,
          password_hash: values.password, // Asegúrate de enviar `password_hash`
          id_rol: 1, // Asigna el rol según tu lógica
        });
        console.log('Usuario creado:', response.data);
        toast.success('Registro exitoso');
        navigate('/login');
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          console.error('Error de registro:', error.response.data);
          toast.error(`Error de registro: ${error.response.data.error}`);
        } else {
          console.error('Error de registro:', error);
          toast.error('Error de registro');
        }
      }
    },
  });

  const goToLogIn = () => {
    navigate('/login');
  }

  return (
    <div className='flex w-full h-screen'>
      <div className='w-full flex items-center justify-center lg:w-1/2'>
        <div className='font-inter bg-customGray px-10 py-20 rounded-3xl border-2 border-gray-200'>
          <h1 className='text-5xl font-semibold text-customGreen'>¡Bienvenido!</h1>
          <p className='font-medium text-lg text-gray-50 mt-4'>Por favor, ingresa tu información para crear una cuenta</p>
          <form onSubmit={formik.handleSubmit} className='mt-8'>
            <div>
              <label className='text-lg font-medium text-white'>Nombre</label>
              <input
                className='w-full border-2 border-black rounded-xl p-4 mt-1 bg-white'
                placeholder='Ingresa tu nombre'
                {...formik.getFieldProps('nombre')}
              />
              {formik.touched.nombre && formik.errors.nombre ? (
                <div className="text-red-500">{formik.errors.nombre}</div>
              ) : null}
            </div>
            <div>
              <label className='text-lg font-medium text-white'>Apellido</label>
              <input
                className='w-full border-2 border-black rounded-xl p-4 mt-1 bg-white'
                placeholder='Ingresa tu apellido'
                {...formik.getFieldProps('apellido')}
              />
              {formik.touched.apellido && formik.errors.apellido ? (
                <div className="text-red-500">{formik.errors.apellido}</div>
              ) : null}
            </div>
            <div>
              <label className='text-lg font-medium text-white'>Correo</label>
              <input
                className='w-full border-2 border-black rounded-xl p-4 mt-1 bg-white'
                placeholder='Ingresa tu correo electrónico'
                {...formik.getFieldProps('email')}
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-red-500">{formik.errors.email}</div>
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
                <div className="text-red-500">{formik.errors.password}</div>
              ) : null}
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
