import { useEffect, useState } from "react";


interface NetworkInformation extends EventTarget {
  effectiveType?: "slow-2g" | "2g" | "3g" | "4g";
  addEventListener(type: "change", listener: () => void): void;
  removeEventListener(type: "change", listener: () => void): void;
}


declare global {
  interface Navigator {
    connection?: NetworkInformation;
  }
}

export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isSlow, setIsSlow] = useState<boolean>(false);

  useEffect(() => {

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    const checkConnectionSpeed = () => {
      if (navigator.connection) {
        setIsSlow(
          navigator.connection.effectiveType === "slow-2g" ||
            navigator.connection.effectiveType === "2g"
        );
      }
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    if (navigator.connection) {
      navigator.connection.addEventListener("change", checkConnectionSpeed);
    }

    setIsOnline(navigator.onLine);
    checkConnectionSpeed();

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      if (navigator.connection) {
        navigator.connection.removeEventListener(
          "change",
          checkConnectionSpeed
        );
      }
    };
  }, []);

  return { isOnline, isSlow };
};
