import { useSnackbar } from "../../contexts/SnackbarContext/SnackbarContext";
import { useAppDispatch } from "../../redux/hooks";
import { updateTodoByField } from "../../redux/todosSlice";
import type { TodoObject } from "../../types";

export default function TodoToggleButton({ todo }: { todo: TodoObject }) {
  const showSnackbar = useSnackbar();
  const dispatch = useAppDispatch();

  function handleTodoToggleClick() {
    dispatch(updateTodoByField({ id: todo.id, key: "isCompleted", value: !todo.isCompleted }))
    showSnackbar({ message: todo.isCompleted ? "Task restarted" : "Task completed" });
  }

  return (
    <button
      className="button-svg"
      onClick={handleTodoToggleClick}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="stroke-gray-600" width="24" height="24" fill="none" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        {todo.isCompleted ?
          <polyline points="8,16 16,8 12,12 8,8 16,16" fill="none" /> :
          <polyline points="7,12 10.5,16 16.5,9" fill="none" />}
      </svg>
    </button >
  )
}