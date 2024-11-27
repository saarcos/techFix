import { LucideIcon, TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

interface CardHomeProps {
  label: string;
  Icon: LucideIcon;
  amount: number;
  secondaryLabel?: string;
  secondaryValue?: number;
  secondaryIcon?: LucideIcon;
  percentage?: number;
  description: string;
  showProgress?: boolean;
  isCurrency?: boolean;
}

const CardHome = ({
  label,
  Icon,
  amount,
  secondaryLabel,
  secondaryValue,
  secondaryIcon: SecondaryIcon,
  percentage,
  description,
  showProgress = true,
  isCurrency = true,
}: CardHomeProps) => {
  const navigate = useNavigate();
  const isNegative = percentage !== undefined && percentage < 0;
  const symbol = percentage !== undefined && percentage >= 0 ? "+" : "";
  const progressValue =
    percentage !== undefined
      ? percentage < 0
        ? 0
        : percentage > 100
          ? 100
          : percentage
      : 0;

  return (
    <Card className="flex flex-col rounded-lg shadow bg-white hover:shadow-lg transition-shadow duration-200 max-h-[15rem] cursor-pointer">
      <CardContent className="relative flex flex-col h-full gap-2 px-4 py-2">
        {/* Ícono de Fondo */}
        <Icon className="absolute right-3 top-3 text-gray-200 opacity-10 w-10 h-10" />

        {/* Título e Ícono */}
        <section className="flex justify-between items-center">
          <p className="text-base md:text-base  sm:text-sm font-semibold text-gray-700 py-1">{label}</p>
          <Icon className="h-6 w-6 text-gray-500" />
        </section>

        {/* Cantidad principal con descripción */}
        <section className="flex flex-col gap-1">
          <h2 className={`text-2xl md:text-3xl font-bold text-gray-900 py-2 ${!isCurrency && "flex items-baseline gap-2"}`}>
            {amount.toLocaleString()}
            {!isCurrency && (
              <span className="text-base text-gray-700">
                nuevos clientes
              </span>
            )}
          </h2>
          {percentage !== undefined && (
            <div className="flex items-center gap-2 mt-2">
              <div
                className={`flex items-center justify-center p-2 rounded-full shadow-md ${isNegative ? "bg-red-100" : "bg-green-100"
                  }`}
              >
                {isNegative ? (
                  <TrendingDownIcon className="h-5 w-5 text-red-500" />
                ) : (
                  <TrendingUpIcon className="h-5 w-5 text-darkGreen" />
                )}
              </div>
              <span
                className={`text-sm font-semibold ${isNegative ? "text-red-600" : "text-darkGreen"
                  }`}
              >
                {`${symbol}${percentage}% `}{description} 
              </span>
            </div>
          )}
        </section>
        {/* Información secundaria */}
        {secondaryLabel && secondaryValue !== undefined && (
          <section className="flex justify-between items-center bg-customGreen/15 px-3 py-1 rounded-md mt-0.5">
            <div>
              <p className="text-sm text-gray-600">{secondaryLabel}</p>
              <h3 className="text-sm font-bold text-gray-950">{secondaryValue.toLocaleString()}</h3>
            </div>
            {SecondaryIcon && <SecondaryIcon className="h-5 w-5 text-gray-500" />}
          </section>
        )}
        {/* Barra de Progreso */}
        {showProgress && percentage !== undefined && (
          <section className="mt-3">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-base font-medium text-gray-600">Tendencia</h4>
              <span className="text-sm text-gray-500">{progressValue}%</span>
            </div>
            <Progress
              value={progressValue}
              alert={isNegative}
              aria-label={`${percentage}%`}
              className={`h-4 rounded-full ${isNegative ? "bg-red-100" : "bg-customGreen/15"}`}
              />
          </section>
        )}

        {/* Botón */}
        {!showProgress && (
          <Button
            onClick={() => navigate("/taller/ordenes")}
            className="w-full bg-customGreen text-black rounded-md py-2 text-sm font-medium hover:bg-customGreen/90 mt-3"
          >
            Ver Órdenes de Trabajo
          </Button>
        )}
      </CardContent>
    </Card>

  );
};

export default CardHome;
