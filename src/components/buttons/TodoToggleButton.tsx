import { useAlert } from "../../contexts/AlertContext/AlertContext";
import { useAppDispatch } from "../../redux/hooks";
import { updateTodoByField } from "../../redux/todosSlice";
import type { TodoObject } from "../../types";

export default function TodoToggleButton({ todo }: { todo: TodoObject }) {
  const showAlert = useAlert();
  const dispatch = useAppDispatch();

  function handleTodoToggleClick() {
    dispatch(updateTodoByField({ id: todo.id, key: "isCompleted", value: !todo.isCompleted }))
    showAlert({ message: todo.isCompleted ? "Task restarted" : "Task completed" });
  }

  return (
    <button
      className="button-svg bg-white rounded-md stroke-black"
      onClick={handleTodoToggleClick}
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