import { createContext, useContext } from "react";

export type ConfirmOptions = {
  message: string;
  cancelText: string;
  confirmText: string;
  onConfirm: VoidFunction;
};

type ConfirmContextType = {
  showConfirm: (options: ConfirmOptions) => void;
};

export const ConfirmContext = createContext<ConfirmContextType | null>(null);

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("ConfirmContext is null: is the component calling the context not in ConfirmContextProvider?");
  }
  return context.showConfirm;
}