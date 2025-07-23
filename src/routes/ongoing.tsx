import { createFileRoute } from "@tanstack/react-router";
import { useTodosContext } from "../contexts/TodosContext/TodosContext";
import NewTodoEditor from "../components/NewTodoEditor";
import TodoList from "../components/TodoList";

export const Route = createFileRoute('/ongoing')({
  component: RouteComponent,
})

function RouteComponent() {
  const { todos } = useTodosContext();
  const unfinishedTodos = todos.filter(todo => !todo.isCompleted);

  return (
    <div id="ongoing" className="flex flex-col items-start gap-4">
      <h1 className="text-3xl font-black w-full">Ongoing tasks</h1>
      {
        unfinishedTodos.length === 0 ?
          <h2 className="w-full break-words hyphens-auto">You don't have any ongoing tasks right now</h2>
          :
          <TodoList todos={unfinishedTodos} />
      }
      <NewTodoEditor />
    </div>
  )
}

