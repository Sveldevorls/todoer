import { createFileRoute } from "@tanstack/react-router";
import { useTodosContext } from "../contexts/TodosContext/TodosContext";
import TodoList from "../components/TodoList";
import Header from "../components/Header";
import { useRef } from "react";
import NewTodoButton from "../components/buttons/NewTodoButton";

export const Route = createFileRoute('/ongoing')({
  component: RouteComponent,
})

function RouteComponent() {
  const { todos } = useTodosContext();
  const titleRef = useRef<HTMLDivElement | null>(null);
  const unfinishedTodos = todos.filter(todo => !todo.isCompleted);

  return (
    <div id="ongoing" className="flex flex-col items-start gap-4">
      <Header
        title="Ongoing tasks"
        titleRef={titleRef}
      />
      <h1 className="text-3xl font-black w-full" ref={titleRef}>Ongoing tasks</h1>
      {
        unfinishedTodos.length === 0 ?
          <h2 className="w-full break-words hyphens-auto">You don't have any ongoing tasks right now</h2>
          :
          <TodoList todos={unfinishedTodos} />
      }
      <NewTodoButton />
    </div>
  )
}

