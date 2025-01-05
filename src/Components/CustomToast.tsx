import { toast } from "sonner";
import { AlertTriangle, BadgeCheck, Info } from "lucide-react";

interface CustomToastProps {
  message: string;
  type?: "warning" | "success" | "error" | "info";
}

const toastStyles = {
  warning: {
    bgColor: "bg-yellow-200",
    borderColor: "border-yellow-500",
    textColor: "text-black",
    icon: <AlertTriangle className="h-6 w-6 text-black" />,
  },
  success: {
    bgColor: "bg-customGreen",
    borderColor: "border-green-800",
    textColor: "text-black",
    icon: <BadgeCheck className="h-6 w-6 text-black" />,
  },
  error: {
    bgColor: "bg-red-700",
    borderColor: "border-red-900",
    textColor: "text-white",
    icon: <AlertTriangle className="h-6 w-6 text-white" />,
  },
  info: {
    bgColor: "bg-blue-600",
    borderColor: "border-blue-800",
    textColor: "text-white",
    icon: <Info className="h-6 w-6 text-white" />,
  },
};

export function CustomToast({ message, type = "warning" }: CustomToastProps) {
  const styles = toastStyles[type];

  toast.custom(() => (
    <div
      className={`flex items-center space-x-4 ${styles.bgColor} ${styles.borderColor} border rounded-lg px-5 py-3 shadow-md w-full max-w-lg mx-auto`}
    >
      <div className="flex items-center justify-center shrink-0">
        {styles.icon}
      </div>
      <div className={`text-sm font-medium ${styles.textColor} break-words`}>
        {message}
      </div>
    </div>
  ));
}
