import { useRef, useState, type ReactNode } from "react";
import { ConfirmContext, type ConfirmOptions } from "./ConfirmContext";

export function ConfirmProvider({ children }: { children: ReactNode }) {
    const dialogRef = useRef<HTMLDialogElement | null>(null);
    const [message, setMessage] = useState<string>("");
    const [cancelText, setCancelText] = useState<string>("");
    const [confirmText, setConfirmText] = useState<string>("");
    const [onConfirmCallback, setOnConfirmCallback] = useState<VoidFunction>(() => { });

    const confirm = ({ message, cancelText, confirmText, onConfirm }: ConfirmOptions) => {
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
        <ConfirmContext.Provider value={{ confirm }}>
            {children}
            <dialog ref={dialogRef} onCancel={handleCancel}>
                <p>{message}</p>
                <div>
                    <button onClick={handleCancel}>{cancelText}</button>
                    <button onClick={handleConfirm}>{confirmText}</button>
                </div>
            </dialog>
        </ConfirmContext.Provider>
    );
}