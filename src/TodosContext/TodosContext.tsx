import { createContext, useContext } from "react";
import type { TodoObject } from "../types";

interface TodosContextValue {
  todos: TodoObject[];
  setTodos: React.Dispatch<React.SetStateAction<TodoObject[]>>;
}


export const TodosContext = createContext<TodosContextValue | null>(null);

export function useTodosContext() {
  const currentTodosContext = useContext(TodosContext);
  if (!currentTodosContext) {
    throw new Error(
      "TodosContext is null: is the component calling the context not in TodosContextProvider?"
    );
  }

  return currentTodosContext;
}