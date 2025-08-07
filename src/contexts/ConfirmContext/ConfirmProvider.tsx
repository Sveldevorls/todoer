import { useEffect, useRef, useState, type ReactNode } from "react";
import { ConfirmContext, type ConfirmOptions } from "./ConfirmContext";
import { createPortal } from "react-dom";

export default function ConfirmProvider({ children }: { children: ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [domReady, setDomReady] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [cancelText, setCancelText] = useState<string>("");
  const [confirmText, setConfirmText] = useState<string>("");
  const [onConfirmCallback, setOnConfirmCallback] = useState<VoidFunction>(() => { });

  useEffect(() => {
    setDomReady(true);
  }, [])

  const showConfirm = ({ title, message, cancelText, confirmText, onConfirm }: ConfirmOptions) => {
    setTitle(title);
    setMessage(message);
    setCancelText(cancelText);
    setConfirmText(confirmText);
    setOnConfirmCallback(() => onConfirm);
    dialogRef.current!.showModal();
  };

  const handleConfirm = () => {
    onConfirmCallback();
    dialogRef.current!.close();
  };

  const handleCancel = () => {
    dialogRef.current!.close();
  };

  return (
    <ConfirmContext.Provider value={{ showConfirm }}>
      {children}
      {
        domReady ?
          createPortal(
            <dialog
              ref={dialogRef}
              onCancel={handleCancel}
              className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2
                p-4 rounded-md shadow-md
                w-[min(90vw,480px)]"
            >
              <h2 className="font-black">{title}</h2>
              <p className="pt-2 pb-8">{message}</p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={handleCancel}
                  className="button-secondary"
                >
                  {cancelText}
                </button>
                <button
                  onClick={handleConfirm}
                  className="button-primary"
                >
                  {confirmText}
                </button>
              </div>
            </dialog>,
            document.getElementById("overlay")!
          )
          :
          null
      }
    </ConfirmContext.Provider>
  );
}