import { useRef, useState, type ReactNode } from "react";
import { AlertContext, type AlertOptions } from "./AlertContext";

export default function AlertProvider({ children }: { children: ReactNode }) {
  const alertRef = useRef<HTMLDivElement | null>(null);
  const [prevTimeout, setPrevTimeout] = useState<number | null>(null);
  const [message, setMessage] = useState<string>("");

  const showAlert = ({ message }: AlertOptions) => {
    if (prevTimeout != null) {
      clearTimeout(prevTimeout);
    }

    setMessage(message);
    alertRef.current!.style.opacity = "100";
    const timeoutID = setTimeout(() => {
      alertRef.current!.style.opacity = "0"
    }, 5000);
    setPrevTimeout(timeoutID);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <div
        ref={alertRef}
        className="
          px-4 py-2 rounded-md shadow-md
          flex items-center gap-4 
          absolute bottom-10 left-1/2 -translate-x-1/2 
        bg-gray-700 text-white 
          opacity-0 transition-opacity duration-300"
      >
        <p>{message}</p>
        <button
          className="p-1 hover:bg-gray-600 filter-none"
          onClick={() => alertRef.current!.style.opacity = "0"}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round">
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="18" y1="6" x2="6" y2="18" />
          </svg>
        </button>
      </div>
    </AlertContext.Provider>
  );
}