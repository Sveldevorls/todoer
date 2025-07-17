import { createFileRoute } from "@tanstack/react-router";
import { useTodosContext } from "../contexts/TodosContext/TodosContext";
import NewTodoEditor from "../components/NewTodoEditor";
import TodoCard from "../components/TodoCard";


export const Route = createFileRoute('/ongoing')({
  component: Home,
})

function Home() {
  const { todos } = useTodosContext();
  const unfinishedTodos = todos.filter(todo => !todo.isCompleted);

  return (
    <div id="home" className="flex flex-col items-start gap-4">
      <h1 className="text-3xl font-black w-full">Ongoing tasks</h1>
      {
        unfinishedTodos.length === 0 ?
          <h2 className="w-full break-words hyphens-auto">You don't have any ongoing tasks right now</h2> :
          <ul className="flex flex-col items-start w-full">
            {unfinishedTodos.map(todo => <TodoCard todo={todo} key={todo.id} />)}
          </ul>
      }
      <NewTodoEditor />
    </div>
  )
}

