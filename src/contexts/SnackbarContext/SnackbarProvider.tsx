import { useEffect, useRef, useState, type ReactNode } from "react";
import { SnackbarContext, type SnackbarOptions } from "./SnackbarContext";
import { createPortal } from "react-dom";

export default function SnackbarProvider({ children }: { children: ReactNode }) {
  const snackbarRef = useRef<HTMLDivElement | null>(null);
  const [domReady, setDomReady] = useState<boolean>(false);
  const [prevTimeout, setPrevTimeout] = useState<number | null>(null);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    setDomReady(true);
  }, [])


  const showSnackbar = ({ message }: SnackbarOptions) => {
    if (prevTimeout != null) {
      clearTimeout(prevTimeout);
    }

    setMessage(message);
    snackbarRef.current!.style.opacity = "100";
    snackbarRef.current!.style.pointerEvents = "auto";
    const timeoutID = setTimeout(() => {
      snackbarRef.current!.style.opacity = "0";
      snackbarRef.current!.style.pointerEvents = "none";
    }, 5000);
    setPrevTimeout(timeoutID);
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      {
        domReady ?
          createPortal(
            <div
              id="snackbar"
              ref={snackbarRef}
              className="
          w-fit pl-4 pr-2 py-2 rounded-md shadow-md pointer-events-none
          flex items-center gap-2
          fixed bottom-10 left-1/2 -translate-x-1/2 
        bg-gray-700 text-white 
          opacity-0 transition-opacity duration-300"
            >
              <p>{message}</p>
              <button
                className="button-svg hover:bg-gray-600"
                onClick={() => {
                  snackbarRef.current!.style.opacity = "0";
                  snackbarRef.current!.style.pointerEvents = "none";
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.1" strokeLinecap="round">
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="18" y1="6" x2="6" y2="18" />
                </svg>
              </button>
            </div>,
            document.getElementById("overlay")!
          )
          :
          null
      }
    </SnackbarContext.Provider >
  );
}