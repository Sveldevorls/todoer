import { createFileRoute } from "@tanstack/react-router";
import { useTodosContext } from "../contexts/TodosContext/TodosContext";
import TodoCard from "../components/TodoCard";

export const Route = createFileRoute('/finished')({
  component: RouteComponent,
})

function RouteComponent() {
  const { todos } = useTodosContext();

  const finishedTodos = todos.filter(todo => todo.isCompleted);

  return (
    <div id="home" className="flex flex-col items-start gap-4">
      <h1 className="text-3xl font-black w-full">Finished tasks</h1>
      {
        finishedTodos.length === 0 ?
          <h2 className="w-full">You don't have any finished tasks yet</h2> :
          <ul className="flex flex-col items-start gap-2 w-full">
            {finishedTodos.map(todo => <TodoCard todo={todo} key={todo.id} />)}
          </ul>
      }
    </div>
  )
}
