import { useAlert } from "../../contexts/AlertContext/AlertContext";
import { useTodosContext } from "../../contexts/TodosContext/TodosContext";
import type { TodoObject } from "../../types";

export default function TodoToggleButton({ todo }: { todo: TodoObject }) {
  const { todos, setAndSaveTodos } = useTodosContext();
  const showAlert = useAlert();

  function handleTodoFinishClick() {
    const nextTodos = todos.map(nextTodo =>
      nextTodo.id === todo.id ? { ...nextTodo, isCompleted: true } : nextTodo
    )
    showAlert({ message: "Task completed" });
    setAndSaveTodos(nextTodos);
  }

  function handleTodoRestartClick() {
    const nextTodos = todos.map(nextTodo =>
      nextTodo.id === todo.id ? { ...nextTodo, isCompleted: false } : nextTodo
    )
    showAlert({ message: "Task restarted" });
    setAndSaveTodos(nextTodos);
  }

  return (
    <button
      className="button-svg bg-white rounded-md stroke-black"
      onClick={todo.isCompleted ? handleTodoRestartClick : handleTodoFinishClick}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" strokeWidth="1.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        {todo.isCompleted ?
          <polyline points="8,16 16,8 12,12 8,8 16,16" fill="none" /> :
          <polyline points="6.5,12 10.5,16 16.5,9" fill="none" />}
      </svg>
    </button>
  )
}