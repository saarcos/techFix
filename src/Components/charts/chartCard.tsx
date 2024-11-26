import { Card, CardContent } from "@/Components/ui/card";

const ChartCard = ({ children }: { children: React.ReactNode }) => {
  return (
    <Card className="border-none hover:from-gray-100 h-full shadow-lg bg-gradient-to-br">
      <CardContent className="flex w-full flex-col gap-3 rounded-xl border p-5 shadow-md transition-transform cursor-pointer h-full">
        {children}
      </CardContent>
    </Card>
  );
};

export default ChartCard;
