import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useConfirm } from "../contexts/ConfirmContext/ConfirmContext";
import { useAlert } from "../contexts/AlertContext/AlertContext";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { deleteTodo, updateTodoByField } from "../redux/todosSlice";
import type { TodoObject } from "../types";
import DeleteIcon from "./icons/DeleteIcon";
import EditIcon from "./icons/EditIcon";
import Menu from "./Menu";
import MenuItem from "./MenuItem";
import { QuickTodoEditor } from "./QuickTodoEditor";

export default function TodoCard({ todo }: { todo: TodoObject }) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const groups = useAppSelector(state => state.groups.groups);
  const showAlert = useAlert();
  const showConfirm = useConfirm();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  function handleTodoToggleClick() {
    dispatch(updateTodoByField({ id: todo.id, key: "isCompleted", value: !todo.isCompleted }))
    showAlert({
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
      <QuickTodoEditor
        mode="edit"
        currTodo={todo}
        closeHandler={() => setIsEditing(false)}
      />
    )
  }

  return (
    <div className="group flex relative hover:bg-gray-100 hover:cursor-pointer @container">
      <div className="absolute top-3 left-2">
        <ToggleTodoButton isCompleted={todo.isCompleted} clickHandler={handleTodoToggleClick} />
      </div>
      <div
        className="py-3 px-10 border-b-1 border-gray-400 flex-grow min-w-0"
        onClick={handleTodoNavigateClick}
      >
        <h3 className="font-bold truncate">{todo.title}</h3>
        <p className="break-all line-clamp-2 text-sm">{todo.description}</p>
        <div className="flex gap-1">
          {
            todo.group &&
            <p className="w-fit max-w-[10em] px-2 py-1 mt-1 bg-blue-500 text-xs text-white font-bold truncate rounded-md">
              {groups.find(group => group.id === todo.group)!.title}
            </p>
          }
          {
            todo.date &&
            <p className="w-fit max-w-[10em] px-2 py-1 mt-1 bg-slate-100 border-1 border-gray-600 text-xs text-black font-bold truncate rounded-md">
              {new Date(todo.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </p>
          }
          {
            todo.notes &&
            <p className="w-fit max-w-[10em] px-2 py-1 mt-1 bg-slate-100 border-1 border-gray-600 text-xs text-black font-bold truncate rounded-md">
              Has notes
            </p>
          }
        </div>
      </div>
      <button className="button-svg absolute top-2 right-2 opacity-0 group-hover:opacity-100">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
          viewBox="0 0 24 24">
          <circle cx="5" cy="12" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="19" cy="12" r="2" />
        </svg>
      </button>
      <Menu>
        <MenuItem onClick={() => setIsEditing(true)}>
          <EditIcon />
          Edit
        </MenuItem>
        <MenuItem onClick={() => {
          showConfirm({
            message: "This action can not be reversed. Are you sure?",
            cancelText: "Cancel",
            confirmText: "Yes, delete this task",
            onConfirm: () => {
              showAlert({ message: "Task deleted" });
              dispatch(deleteTodo(todo.id))
            },
          })
        }}
        >
          <DeleteIcon />
          Delete
        </MenuItem>
      </Menu>
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
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" fill="none" strokeWidth="3" />
        }
      </svg>
    </button>
  )
}