import { LucideIcon, TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
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
    <Card className="flex flex-col flex-grow rounded-lg shadow bg-gradient-to-br from-white to-gray-50 hover:from-gray-100 h-full sm:min-h-[12rem] lg:min-h-[14rem] 2xl:min-h-[16rem]">
      <CardContent className="relative flex flex-col h-full gap-3 p-4 sm:p-5 lg:p-6">
        {/* Ícono de Fondo */}
        <Icon className="absolute right-4 top-4 text-gray-200 opacity-20 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14" />

        {/* Sección Superior */}
        <section className="flex justify-between items-center mb-1">
          <p className="text-sm sm:text-base lg:text-lg font-medium text-gray-700">
            {label}
          </p>
          <Icon className="h-6 w-6 text-gray-500" />
        </section>

        {/* Sección Media (crece proporcionalmente) */}
        <section className="flex flex-col gap-2 justify-center">
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 mb-3">
              {isCurrency ? `$${amount.toLocaleString()}` : amount.toLocaleString()}
            </h2>
            {percentage !== undefined && (
              <div className="flex items-center gap-1 mt-1">
                <Badge
                  className={`p-2 rounded-full ${
                    isNegative
                      ? "bg-red-500 text-white hover:bg-red-500/50"
                      : "bg-customGreen text-black hover:bg-customGreen/50"
                  }`}
                >
                  {isNegative ? (
                    <TrendingDownIcon className="h-4 w-4" />
                  ) : (
                    <TrendingUpIcon className="h-4 w-4" />
                  )}
                </Badge>
                <span
                  className={`text-sm font-semibold ${
                    isNegative ? "text-red-500" : "text-customGreen"
                  }`}
                >
                  {`${symbol}${percentage}% ${description}`}
                </span>
              </div>
            )}
          </div>

          {/* Información secundaria */}
          {secondaryLabel && secondaryValue !== undefined && (
            <div className="flex justify-between bg-customGreen/10 p-3 rounded-lg">
              <div>
                <p className="text-sm lg:text-base text-gray-700">{secondaryLabel}</p>
                <h3 className="text-base lg:text-lg font-bold text-gray-900">
                  {secondaryValue.toLocaleString()}
                </h3>
              </div>
              {SecondaryIcon && <SecondaryIcon className="h-6 w-6 text-gray-500" />}
            </div>
          )}
        </section>

        {/* Área de Tendencias o Botón */}
        <section className="mt-2">
          {showProgress && percentage !== undefined ? (
            <>
              <h3 className="text-sm font-medium text-gray-600 mb-3">Tendencia</h3>
              <Progress
                value={progressValue}
                alert={isNegative}
                aria-label={`${percentage}%`}
                className="h-6 rounded-full"
              />
            </>
          ) : (
            <Button
              onClick={() => navigate("/taller/ordenes")}
              className="w-full bg-customGreen text-black rounded-lg py-2 text-sm font-medium hover:bg-customGreen/90"
            >
              Ver Órdenes de Trabajo
            </Button>
          )}
        </section>
      </CardContent>
    </Card>
  );
};

export default CardHome;
