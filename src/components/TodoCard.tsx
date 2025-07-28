import type { TodoObject } from "../types";
import { useTodosContext } from "../contexts/TodosContext/TodosContext";
import { useAlert } from "../contexts/AlertContext/AlertContext";
import { useGroupsContext } from "../contexts/GroupsContext/GroupsContext";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { QuickTodoEditor } from "./QuickTodoEditor";


export default function TodoCard({ todo }: { todo: TodoObject }) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { todos, setAndSaveTodos } = useTodosContext();
  const { groups } = useGroupsContext();
  const showAlert = useAlert();
  const navigate = useNavigate();

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
    <div className="group flex relative hover:bg-gray-100 hover:cursor-pointer">
      <div className="absolute top-2 left-2">
        {todo.isCompleted ?
          <RestartTodoButton clickHandler={handleTodoToggleClick} /> :
          <FinishTodoButton clickHandler={handleTodoToggleClick} />
        }
      </div>
      <div
        className="p-2 px-10 border-b-1 border-gray-400 flex-grow min-w-0"
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
      <div className="button-svg hover:bg-white rounded-md opacity-0 group-hover:opacity-100 absolute top-2 right-2" onClick={() => setIsEditing(true)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      </div>
    </div>
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