import { useRef, useState, type ReactNode } from "react";
import { ConfirmContext, type ConfirmOptions } from "./ConfirmContext";

export default function ConfirmProvider({ children }: { children: ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [message, setMessage] = useState<string>("");
  const [cancelText, setCancelText] = useState<string>("");
  const [confirmText, setConfirmText] = useState<string>("");
  const [onConfirmCallback, setOnConfirmCallback] = useState<VoidFunction>(() => { });

  const showConfirm = ({ message, cancelText, confirmText, onConfirm }: ConfirmOptions) => {
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
      <dialog
        ref={dialogRef}
        onCancel={handleCancel}
        className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2
                p-4 rounded-md shadow-md
                w-[min(90vw,480px)]"
      >
        <p className="p-4">{message}</p>
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
      </dialog>
    </ConfirmContext.Provider>
  );
}