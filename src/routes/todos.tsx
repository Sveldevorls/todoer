import { createFileRoute } from "@tanstack/react-router";
import { useTodosContext } from "../contexts/TodosContext/TodosContext";
import NewTodoEditor from "../NewTodoEditor/NewTodoEditor";
import TodoCard from "../components/TodoCard";


export const Route = createFileRoute('/todos')({
  component: Home,
})

function Home() {
  const { todos } = useTodosContext();
  const unfinishedTodos = todos.filter(todo => !todo.isCompleted);

  return (
    <div id="home" className="flex flex-col items-start gap-4 p-2">
      <h1 className="text-4xl font-black w-full">My tasks</h1>
      {
        unfinishedTodos.length === 0 ?
          <h2 className="w-full break-words hyphens-auto">You don't have any todos in progress right now</h2> :
          <ul className="flex flex-col items-start gap-2 w-full">
            {unfinishedTodos.map(todo => <TodoCard todo={todo} key={todo.id} />)}
          </ul>
      }
      <NewTodoEditor />
    </div>
  )
}

