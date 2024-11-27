interface SalesCardProps {
  name: string;
  email: string;
  saleAmount: number | null; // Ahora permite `null`
}

const SalesCard = ({ name, email, saleAmount }: SalesCardProps) => {
  return (
    <div className="flex items-center justify-between gap-2 sm:gap-4 border-b py-3 sm:py-4 last:border-none min-h-[4rem]">
      {/* Avatar e información del cliente */}
      <div className="flex items-center gap-2 sm:gap-4 flex-grow">
        <div className="flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-customGreen/15 text-gray-600 font-semibold text-base sm:text-lg">
          {name[0]} {/* Muestra la inicial del nombre */}
        </div>
        <div className="flex flex-col">
          <p className="text-sm sm:text-base font-medium text-gray-800 truncate">
            {name}
          </p>
          <a
            href={`mailto:${email}`}
            className="text-xs sm:text-sm text-gray-500 truncate max-w-[10rem] sm:max-w-[14rem] hover:underline"
          >
            {email}
          </a>
        </div>
      </div>
      {/* Monto de venta */}
      <div className="text-right">
        <p className="text-sm sm:text-base font-semibold text-gray-900">
          ${saleAmount ? saleAmount.toLocaleString() : "0"}
        </p>
      </div>
    </div>
  );
};

export default SalesCard;
