import { useTodosContext } from "../TodosContext/TodosContext";
import NewTodoEditor from "../NewTodoEditor/NewTodoEditor";
import type { TodoObject } from "../types";
import { useAlert } from "../AlertContext/AlertContext";

export default function Home() {
  const { todos } = useTodosContext();
  console.log(todos);

  const finishedTodos = todos.filter(todo => todo.isCompleted);
  const unfinishedTodos = todos.filter(todo => !todo.isCompleted);

  console.log(finishedTodos, unfinishedTodos)

  return (
    <div id="home" className="flex flex-col items-center gap-4 text-center p-2">
      <h1 className="text-4xl font-black w-full">Home</h1>
      {
        todos.length === 0 ?
          <h2 className="w-full">There are currently no todos</h2> :
          <ul className="flex flex-col items-center gap-2 w-full">
            <div>
              <h2>In progress</h2>
              {unfinishedTodos.map(todo => <TodoCard todo={todo} key={todo.id} />)}
            </div>
            <div>
              <h2>Finished</h2>
              {finishedTodos.map(todo => <TodoCard todo={todo} key={todo.id} />)}
            </div>
          </ul>
      }
      <NewTodoEditor />
    </div>
  )
}

function TodoCard({ todo }: { todo: TodoObject }) {
  const { todos, setTodos } = useTodosContext();
  const showAlert = useAlert();

  function handleTodoFinishClick() {
    if (!todo.isCompleted) {
      const nextTodos = todos.map(nextTodo =>
        nextTodo.id === todo.id ? { ...nextTodo, isCompleted: true } : nextTodo
      )
      showAlert({
        message: "Task completed"
      })

      setTodos(nextTodos);
    }
  }

  return (
    <li className="flex items-start p-2 gap-3 w-[min(90vw,480px)] text-left border-b-gray-200 hover:bg-gray-100 border-b-1">
      <button
        className="w-[24px] h-[24px] p-0 rounded-full
                    border-2 border-gray-300 hover:border-green-500 
                    transition-colors 
                    flex items-center justify-center shrink-0 group"
        onClick={handleTodoFinishClick}
        title="Mark as finished"
      >
        <svg
          className="w-[16px] h-[16px] stroke-green-500 opacity-0 duration-300 group-hover:opacity-100"
          viewBox="0 0 24 24"
        >
          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" fill="none" strokeWidth="3" />
        </svg>
      </button>
      <div className="min-w-0 flex-1">
        <h3 className="font-bold truncate">{todo.title} {todo.isCompleted && <span className="text-xs">Finished</span>}</h3>
        <p className="text-sm break-all line-clamp-2">{todo.description}</p>
      </div>
    </li>
  )
}