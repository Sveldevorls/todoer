import { useNavigate } from "@tanstack/react-router";
import { useConfirm } from "../../contexts/ConfirmContext/ConfirmContext";
import { useSnackbar } from "../../contexts/SnackbarContext/SnackbarContext";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { deleteTodo, updateTodoByField } from "../../redux/todosSlice";
import type { TodoObject } from "../../types";
import DeleteIcon from "../icons/DeleteIcon";
import EditIcon from "../icons/EditIcon";
import Menu from "../Menu";
import MenuItem from "../MenuItem";
import TodoEditor from "./TodoEditor";

type TodoCardProps = {
  todo: TodoObject;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<string>>;
}

export default function TodoCard({ todo, isEditing, setIsEditing }: TodoCardProps) {
  const groups = useAppSelector(state => state.groups.groups);
  const showSnackbar = useSnackbar();
  const showConfirm = useConfirm();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  function formatDate(dateTimestamp: string) {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1); tomorrow.setHours(0, 0, 0, 0);
    const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1); yesterday.setHours(0, 0, 0, 0);
    const inputDate = new Date(parseInt(dateTimestamp, 10)); inputDate.setHours(0, 0, 0, 0);

    // before today - overdue
    if (inputDate < today) {
      return "Overdue"
    }
    // today
    else if (
      inputDate.getFullYear() === today.getFullYear() &&
      inputDate.getMonth() === today.getMonth() &&
      inputDate.getDay() === today.getDay()
    ) {
      return "Today"
    }
    // tomorrow
    else if (
      inputDate.getFullYear() === tomorrow.getFullYear() &&
      inputDate.getMonth() === tomorrow.getMonth() &&
      inputDate.getDay() === tomorrow.getDay()
    ) {
      return "Tomorrow"
    }
    // future date - MMM DD
    return inputDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  function formatDateColor(dateTimestamp: string) {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1); yesterday.setHours(0, 0, 0, 0);
    const inputDate = new Date(parseInt(dateTimestamp, 10)); inputDate.setHours(0, 0, 0, 0);

    // overdue - red
    if (inputDate < today) {
      return "text-red-600"
    }
    // today - green
    else if (
      inputDate.getFullYear() === today.getFullYear() &&
      inputDate.getMonth() === today.getMonth() &&
      inputDate.getDay() === today.getDay()
    ) {
      return "text-green-600"
    }
    // future - blue
    return "text-blue-700"

  }

  function handleTodoToggleClick() {
    dispatch(updateTodoByField({ id: todo.id, key: "isCompleted", value: !todo.isCompleted }))
    showSnackbar({
      message: todo.isCompleted ? "Task restarted" : "Task completed"
    })
  }

  function handleTodoNavigateClick() {
    navigate({
      to: "/tasks/$taskID",
      params: { taskID: todo.id },
    })
  }

  if (isEditing) {
    return (
      <TodoEditor
        mode="edit"
        currTodo={todo}
        closeHandler={() => setIsEditing("")}
      />
    )
  }

  return (
    <div className="group flex relative hover:bg-gray-100 hover:cursor-pointer @container">
      <div className="absolute top-2 left-2">
        <ToggleTodoButton isCompleted={todo.isCompleted} clickHandler={handleTodoToggleClick} />
      </div>
      <div
        className="py-2 px-10 border-b-1 border-gray-300 flex-grow min-w-0"
        onClick={handleTodoNavigateClick}
      >
        <div>
          <h3 className="font-bold truncate">{todo.title}</h3>
          <p className="line-clamp-2 text-sm">{todo.description}</p>
        </div>
        <div className="flex justify-between items-center flex-wrap mt-1 text-xs text-blue-700 font-black">
          <div className="flex gap-1 mr-10 [&>p+p:before]:content-['•'] [&>p+p:before]:mr-[4px]">
            {
              todo.date &&
              <p className={`${formatDateColor(todo.date)}`}>
                {formatDate(todo.date)}
              </p>
            }
            {
              todo.notes &&
              <p>
                Has notes
              </p>
            }
          </div>
          <div>
            {
              todo.group &&
              <p className="max-w-[12em] truncate">
                #{groups.find(group => group.id === todo.group)!.title}
              </p>
            }
          </div>
        </div>
      </div>
      <div className="absolute top-1.5 right-2 opacity-0 group-hover:opacity-100">
        <Menu>
          <MenuItem onClick={() => setIsEditing(todo.id)}>
            <EditIcon />
            <div>Edit</div>
          </MenuItem>
          <MenuItem onClick={() => {
            showConfirm({
              title: "Delete this task?",
              message: "This action can not be reversed. Are you sure?",
              cancelText: "Cancel",
              confirmText: "Yes, delete this task",
              onConfirm: () => {
                showSnackbar({ message: "Task deleted" });
                dispatch(deleteTodo(todo.id))
              },
            })
          }}
          >
            <DeleteIcon />
            <div>Delete</div>
          </MenuItem>
        </Menu>
      </div>
    </div >
  )
}

function ToggleTodoButton({ isCompleted, clickHandler }: { isCompleted: boolean, clickHandler: VoidFunction }) {
  return (
    <button
      className={`
        w-[24px] h-[24px] p-0 rounded-full
        border-2 border-gray-300 transition-colors 
        flex items-center justify-center shrink-0 group/toggle
        ${isCompleted ? "hover:border-red-500" : "hover:border-green-500"}
      `}
      onClick={clickHandler}
      title={`${isCompleted ? "Mark as ongoing" : "Mark as finished"}`}
    >
      <svg
        className={`w-[16px] h-[16px] duration-300 opacity-0 group-hover/toggle:opacity-100
          ${isCompleted ? "stroke-red-500" : "stroke-green-500"}
        `}
        viewBox="0 0 24 24" strokeWidth="3" strokeLinecap="round"
      >
        {
          isCompleted ?
            <>
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </>
            :
            <path d="M5 13l4 4L19 7" fill="none" />
        }
      </svg>
    </button>
  )
}