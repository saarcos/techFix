import { useEffect, useState } from 'react';
import Spinner from '../assets/tube-spinner.svg';
import { toast } from 'sonner';
import { getUsers, User } from '@/api/userService';
import { DataTable } from '@/Components/data-table';
import {columns} from '../tables/usuarios/columns'
const Tecnicos = () => {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await getUsers();
        setData(users);
        setLoading(false);
      } catch (error) {
        setError(error as Error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return  <div className="flex justify-center items-center h-28"> <img src={Spinner} className="w-16 h-16"/> </div>;
  if (error) return toast.error('Error al recuperar los usuarios');

  return (
    <div>
      <DataTable data={data} columns={columns}/>
    </div>
  );
};

export default Tecnicos;
