import type { TodoObject } from "../../types";
import TodoCard from "./TodoCard";

type TodoListProps = {
  todos: TodoObject[];
  currEditingTodoID: string;
  setCurrEditingTodoID: React.Dispatch<React.SetStateAction<string>>;
}

export default function TodoList({ todos, currEditingTodoID, setCurrEditingTodoID }: TodoListProps) {
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