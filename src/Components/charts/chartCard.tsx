import { Card, CardContent } from "@/Components/ui/card";

const ChartCard = ({ children }: { children: React.ReactNode }) => {
  return (
    <Card className="border-none hover:from-gray-100 h-full bg-gradient-to-br">
      <CardContent className="flex w-full flex-col gap-2 sm:gap-3 rounded-xl border p-3 sm:p-4 shadow-md transition-transform cursor-pointer h-full max-h-[28vh] md:max-h-[35vh]">
        {children}
      </CardContent>
    </Card>
  );
};

export default ChartCard;
