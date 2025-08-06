import { createContext, useContext } from "react";

export type SnackbarOptions = {
  message: string;
};

type SnackbarContextType = {
  showSnackbar: (options: SnackbarOptions) => void;
};

export const SnackbarContext = createContext<SnackbarContextType | null>(null);

export function useSnackbar() {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("SnackbarContext is null: is the component calling the context not in SnackbarContextProvider?");
  }
  return context.showSnackbar;
}