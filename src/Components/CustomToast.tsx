// src/components/CustomToast.tsx
import { toast } from "sonner";
import { AlertTriangle, Check, Info } from "lucide-react";

interface CustomToastProps {
  message: string;
  type?: "warning" | "success" | "error" | "info"; // Define tipos opcionales para futuros usos.
}

const toastStyles = {
  warning: {
    bgColor: "bg-[#FFF4E5]",
    borderColor: "border-[#FFD6A5]",
    textColor: "text-[#A1600B]",
    icon: <AlertTriangle className="h-7 w-7 text-[#A1600B]" />,
  },
  success: {
    bgColor: "bg-[#E6F7E9]",
    borderColor: "border-[#A7D7A8]",
    textColor: "text-[#006D32]",
    icon: <Check className="h-7 w-7 text-[#006D32]" />, // Cambia este icono si necesitas otro.
  },
  error: {
    bgColor: "bg-[#FDECEA]",
    borderColor: "border-[#F4BFBF]",
    textColor: "text-[#9F3A38]",
    icon: <AlertTriangle className="h-7 w-7 text-[#9F3A38]" />,
  },
  info: {
    bgColor: "bg-[#E8F4FD]",
    borderColor: "border-[#A4D9F9]",
    textColor: "text-[#0B75C9]",
    icon: <Info className="h-7 w-7 text-[#0B75C9]" />,
  },
};

export function CustomToast({ message, type = "warning" }: CustomToastProps) {
  const styles = toastStyles[type];

  toast.custom(() => (
    <div
      className={`flex items-center space-x-3 ${styles.bgColor} ${styles.borderColor} border rounded-lg px-6 py-4 shadow-md max-w-lg w-[calc(100%-2rem)] mx-auto`}
    >
      {styles.icon}
      <div className={`text-sm ${styles.textColor}`}>
        {message}
      </div>
    </div>
  ));
}
