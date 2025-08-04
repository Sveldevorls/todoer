import { useState } from "react";
import type { TodoObject } from "../../types";
import TodoCard from "./TodoCard";

export default function TodoList({ todos }: { todos: TodoObject[] }) {
  const [currEditingTodoID, setCurrEditingTodoID] = useState<string>("");

  return (
    <ul className="flex flex-col items-start w-full">
      {todos.map(todo =>
        <li className="w-full" key={todo.id} >
          <TodoCard todo={todo} isEditing={currEditingTodoID === todo.id} setIsEditing={setCurrEditingTodoID} />
        </li>
      )}
    </ul>
  )
}