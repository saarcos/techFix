import { Card, CardContent } from "@/Components/ui/card";

const ChartCard = ({ children }: { children: React.ReactNode }) => {
  return (
    <Card className="border-none hover:shadow-lg transition-shadow duration-200 h-full">
    <CardContent className="flex w-full flex-col gap-y-2 md:gap-y-3 rounded-xl border p-4 shadow-md transition-transform cursor-pointer max-h-[15rem]">
        {children}
      </CardContent>
    </Card>
  );
};

export default ChartCard;
