interface SalesCardProps {
  name: string;
  email: string;
  saleAmount: number;
}

const SalesCard = ({ name, email, saleAmount }: SalesCardProps) => {
  return (
    <div className="flex items-center justify-between gap-4 border-b py-2 last:border-none">
      {/* Avatar e información del cliente */}
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-lg bg-customGreen/15 flex items-center justify-center text-gray-600 font-semibold">
          {name[0]} {/* Muestra la inicial del nombre */}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800">{name}</p>
          <a href={`mailto:${email}`} className="text-sm text-gray-500 truncate max-w-[150px] sm:max-w-none hover:underline">{email}</a>
        </div>
      </div>

      {/* Monto de venta */}
      <div className="text-right">
        <p className="text-sm font-semibold text-gray-900">${saleAmount.toLocaleString()}</p>
      </div>
    </div>
  );
};

export default SalesCard;
