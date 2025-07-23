import type { TodoObject } from "../types";
import TodoCard from "./TodoCard";

export default function TodoList({ todos }: { todos: TodoObject[] }) {
  return (
    <ul className="flex flex-col items-start w-full">
      {todos.map(todo =>
        <li className="w-full" key={todo.id} >
          <TodoCard todo={todo} />
        </li>
      )}
    </ul>
  )
}