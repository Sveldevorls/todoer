import { createContext, useContext } from "react";

export type AlertOptions = {
  message: string;
};

type AlertContextType = {
  showAlert: (options: AlertOptions) => void;
};

export const AlertContext = createContext<AlertContextType | null>(null);

export function useAlert() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("AlertContext is null: is the component calling the context not in AlertContextProvider?");
  }
  return context.showAlert;
}