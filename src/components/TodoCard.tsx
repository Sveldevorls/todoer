import type { TodoObject } from "../types";
import { useTodosContext } from "../contexts/TodosContext/TodosContext";
import { useAlert } from "../contexts/AlertContext/AlertContext";
import { useGroupsContext } from "../contexts/GroupsContext/GroupsContext";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { QuickTodoEditor } from "./QuickTodoEditor";
import { useConfirm } from "../contexts/ConfirmContext/ConfirmContext";
import DeleteIcon from "./icons/DeleteIcon";
import EditIcon from "./icons/EditIcon";
import Menu from "./Menu/Menu";
import MenuItem from "./Menu/MenuItem";

export default function TodoCard({ todo }: { todo: TodoObject }) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { todos, setAndSaveTodos } = useTodosContext();
  const { groups } = useGroupsContext();
  const showAlert = useAlert();
  const navigate = useNavigate();
  const showConfirm = useConfirm();

  function handleTodoToggleClick() {
    const nextTodos = todos.map(nextTodo =>
      nextTodo.id === todo.id ? { ...nextTodo, isCompleted: !todo.isCompleted } : nextTodo
    )
    showAlert({
      message: todo.isCompleted ? "Task restarted" : "Task completed"
    })
    setAndSaveTodos(nextTodos);
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
        {todo.isCompleted ?
          <RestartTodoButton clickHandler={handleTodoToggleClick} /> :
          <FinishTodoButton clickHandler={handleTodoToggleClick} />
        }
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
            todo.notes &&
            <p className="w-fit max-w-[10em] px-2 py-1 mt-1 bg-slate-100 border-1 border-gray-600 text-xs text-black font-bold truncate rounded-md">
              Has notes
            </p>
          }
        </div>
      </div>
      <button className="button-svg absolute top-2 right-2 bg-white rounded-md opacity-0 group-hover:opacity-100">
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
              setAndSaveTodos(todos.filter(nextTodo => nextTodo.id != todo.id));
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

function FinishTodoButton({ clickHandler }: { clickHandler: VoidFunction }) {
  return (
    <button
      className="w-[24px] h-[24px] p-0 rounded-full
              border-2 border-gray-300 hover:border-green-500
              transition-colors 
              flex items-center justify-center shrink-0 group/finish"
      onClick={clickHandler}
      title="Mark as finished"
    >
      <svg
        className="w-[16px] h-[16px] stroke-green-500
          opacity-0 duration-300 group-hover/finish:opacity-100"
        viewBox="0 0 24 24"
        strokeWidth="3"
        strokeLinecap="round"
      >
        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" fill="none" strokeWidth="3" />
      </svg>
    </button>
  )
}

function RestartTodoButton({ clickHandler }: { clickHandler: VoidFunction }) {
  return (
    <button
      className="w-[24px] h-[24px] p-0 rounded-full
              border-2 border-gray-300 hover:border-red-500
              transition-colors 
              flex items-center justify-center shrink-0 group/restart"
      onClick={clickHandler}
      title="Mark as unfinished"
    >
      <svg
        className="w-[16px] h-[16px] stroke-red-500
          opacity-0 duration-300 group-hover/restart:opacity-100"
        viewBox="0 0 24 24"
        strokeWidth="3"
        strokeLinecap="round"
      >
        <line x1="6" y1="6" x2="18" y2="18" />
        <line x1="18" y1="6" x2="6" y2="18" />
      </svg>
    </button>
  )
}