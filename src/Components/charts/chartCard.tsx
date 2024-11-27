import { Card, CardContent } from "@/Components/ui/card";

const ChartCard = ({ children }: { children: React.ReactNode }) => {
  return (
    <Card className="border-none hover:from-gray-100 h-full bg-gradient-to-br">
    <CardContent className="flex w-full flex-col gap-y-2 md:gap-y-3 rounded-xl border p-4 shadow-md transition-transform cursor-pointer h-full">
        {children}
      </CardContent>
    </Card>
  );
};

export default ChartCard;
