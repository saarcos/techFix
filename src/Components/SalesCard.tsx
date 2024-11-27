interface SalesCardProps {
  name: string;
  email: string;
  saleAmount: number | null; // Ahora permite `null`
}

const SalesCard = ({ name, email, saleAmount }: SalesCardProps) => {
  return (
    <div className="flex items-center justify-between gap-2 sm:gap-4 border-b py-2 sm:py-3 last:border-none h-[8vh]">
      {/* Avatar e información del cliente */}
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-customGreen/15 flex items-center justify-center text-gray-600 font-semibold text-sm sm:text-base">
          {name[0]} {/* Muestra la inicial del nombre */}
        </div>
        <div className="flex flex-col">
          <p className="text-sm font-medium text-gray-800">{name}</p>
          <a href={`mailto:${email}`}
            className="text-xs sm:text-sm text-gray-500 truncate max-w-[120px] sm:max-w-none hover:underline"
          >{email}</a>
        </div>
      </div>
      {/* Monto de venta */}
      <div className="text-right">
        <p className="text-xs sm:text-sm font-semibold text-gray-900">
          ${saleAmount ? saleAmount.toLocaleString() : "0"}
        </p>
      </div>
    </div>
  );
};

export default SalesCard;
