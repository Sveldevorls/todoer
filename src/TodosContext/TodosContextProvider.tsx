import { useState, type ReactNode } from "react";
import { TodosContext } from "./TodosContext";
import { type TodoObject } from "../types";

export default function TodosContextProvider({ children }: { children: ReactNode }) {
    const [todos, setTodos] = useState<TodoObject[]>([]);
    return (
        <TodosContext.Provider value={{ todos, setTodos }}>
            {children}
        </TodosContext.Provider>
    )
}