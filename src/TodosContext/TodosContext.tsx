import { createContext, useContext, useState, type ReactNode } from "react";
import type { TodoObject } from "../types";

interface TodosContextValue {
    todos: TodoObject[];
    setTodos: React.Dispatch<React.SetStateAction<TodoObject[]>>;
}


const TodosContext = createContext<TodosContextValue | null>(null);

export default function TodosContextProvider({ children }: { children: ReactNode }) {
    const [todos, setTodos] = useState<TodoObject[]>([]);
    return (
        <TodosContext.Provider value={{ todos, setTodos }}>
            {children}
        </TodosContext.Provider>
    )
}

export function useTodosContext() {
    const currentTodosContext = useContext(TodosContext);
    if (!currentTodosContext) {
        throw new Error(
            "TodosContext is null: is the component calling the context not in TodosContextProvider?"
        );
    }

    return currentTodosContext;
}