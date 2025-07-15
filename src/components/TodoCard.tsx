import type { TodoObject } from "../types";
import { useTodosContext } from "../contexts/TodosContext/TodosContext";
import { useAlert } from "../contexts/AlertContext/AlertContext";
import { useGroupsContext } from "../contexts/GroupsContext/GroupsContext";

export default function TodoCard({ todo }: { todo: TodoObject }) {
  const { todos, setAndSaveTodos } = useTodosContext();
  const { groups } = useGroupsContext();
  const showAlert = useAlert();

  function handleTodoFinishClick() {
    const nextTodos = todos.map(nextTodo =>
      nextTodo.id === todo.id ? { ...nextTodo, isCompleted: true } : nextTodo
    )
    showAlert({
      message: "Task completed"
    })

    setAndSaveTodos(nextTodos);
  }

  function handleTodoRestartClick() {
    const nextTodos = todos.map(nextTodo =>
      nextTodo.id === todo.id ? { ...nextTodo, isCompleted: false } : nextTodo
    )
    showAlert({
      message: "Task restarted"
    })

    setAndSaveTodos(nextTodos);
  }

  return (
    <li className="flex items-start p-2 gap-3 w-full text-left border-b-gray-200 hover:bg-gray-100 border-b-1">
      {todo.isCompleted ?
        <RestartTodoButton clickHandler={handleTodoRestartClick} /> :
        <FinishTodoButton clickHandler={handleTodoFinishClick} />
      }
      <div className="min-w-0 flex-1">
        <h3 className="font-bold truncate">{todo.title}</h3>
        <p className="break-all line-clamp-2 text-sm">{todo.description}</p>
        {todo.group &&
          <p className="w-fit max-w-[10em] px-2 py-1 mt-1 bg-blue-500 text-xs text-white font-bold truncate rounded-md">
            {groups.find(group => group.id === todo.group)!.title}
          </p>}
      </div>
    </li>
  )
}

function FinishTodoButton({ clickHandler }: { clickHandler: VoidFunction }) {
  return (
    <button
      className="w-[24px] h-[24px] p-0 rounded-full
              border-2 border-gray-300 hover:border-green-500
              transition-colors 
              flex items-center justify-center shrink-0 group"
      onClick={clickHandler}
      title="Mark as finished"
    >
      <svg
        className="w-[16px] h-[16px] stroke-green-500
          opacity-0 duration-300 group-hover:opacity-100"
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
              flex items-center justify-center shrink-0 group"
      onClick={clickHandler}
      title="Mark as unfinished"
    >
      <svg
        className="w-[16px] h-[16px] stroke-red-500
          opacity-0 duration-300 group-hover:opacity-100"
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