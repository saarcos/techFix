import { Card, CardContent } from "@/Components/ui/card";

const ChartCard = ({ children }: { children: React.ReactNode }) => {
  return (
    <Card className="border-none  hover:shadow-md transition-shadow duration-200 h-full">
    <CardContent className="flex w-full flex-col items-center justify-center gap-y-4 md:gap-y-5 rounded-xl border p-4  transition-transform cursor-pointer">
      {children}
    </CardContent>
  </Card>
  
  );
};

export default ChartCard;
