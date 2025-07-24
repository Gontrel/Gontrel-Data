import { toast } from "react-hot-toast";

export const successToast = (message: string) => {
  toast.success(message, {
    duration: 4000,
    position: "top-right",
    style: {
      background: "#4CAF50",
      color: "white",
    },
  });
};

export const errorToast = (message: string) => {
  toast.error(message, {
    duration: 4000,
    position: "top-right",
    style: {
      background: "#F44336",
      color: "white",
    },
  });
};
