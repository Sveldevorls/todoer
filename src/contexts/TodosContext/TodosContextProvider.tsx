import { useState, type ReactNode } from "react";
import { TodosContext } from "./TodosContext";
import { type TodoObject } from "../../types";

export default function TodosContextProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState<TodoObject[]>(initializeTodos());

  function initializeTodos(): TodoObject[] | [] {
    const localTodos = localStorage.getItem("todos");
    return localTodos ? JSON.parse(localTodos) : [];
  }

  function setAndSaveTodos(todos: TodoObject[]) {
    setTodos(todos);
    localStorage.setItem("todos", JSON.stringify(todos));
  }

  return (
    <TodosContext.Provider value={{ todos, setAndSaveTodos }}>
      {children}
    </TodosContext.Provider>
  )
}