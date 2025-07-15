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
    alertRef.current!.style.pointerEvents = "auto";
    const timeoutID = setTimeout(() => {
      alertRef.current!.style.opacity = "0";
      alertRef.current!.style.pointerEvents = "none";
    }, 5000);
    setPrevTimeout(timeoutID);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <div
        id="alert"
        ref={alertRef}
        className="
          w-fit pl-4 pr-2 py-2 rounded-md shadow-md
          flex items-center gap-2
          fixed bottom-10 left-1/2 -translate-x-1/2 
        bg-gray-700 text-white 
          opacity-0 transition-opacity duration-300"
      >
        <p>{message}</p>
        <button
          className="button-svg hover:bg-gray-600 filter-none"
          onClick={() => alertRef.current!.style.opacity = "0"}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="18" y1="6" x2="6" y2="18" />
          </svg>
        </button>
      </div>
    </AlertContext.Provider>
  );
}