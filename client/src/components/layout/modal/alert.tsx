import { IoCheckmarkCircle, IoInformationCircle, IoWarning } from "react-icons/io5";
import Button from "@/components/ui/button";

type AlertType = "success" | "error" | "info";

interface AlertProps {
  type: AlertType;
  title: string;
  message: string;
  onConfirm: () => void;
  confirmText?: string;
}

export default function Alert({ 
  type, 
  title, 
  message, 
  onConfirm,
  confirmText = "확인"
}: AlertProps) {
  const icons = {
    success: <IoCheckmarkCircle className="w-12 h-12 text-green-500" />,
    error: <IoWarning className="w-12 h-12 text-red-500" />,
    info: <IoInformationCircle className="w-12 h-12 text-blue-500" />
  };

  return (
    <div className="text-center">
      <div className="flex justify-center mb-4">
        {icons[type]}
      </div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{message}</p>
      <div className="flex justify-center">
        <Button onClick={onConfirm}>
          {confirmText}
        </Button>
      </div>
    </div>
  );
} 