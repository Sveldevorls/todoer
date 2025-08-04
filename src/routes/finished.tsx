import { useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useAppSelector } from "../redux/hooks";
import TodoList from "../components/todos/TodoList";
import Header from "../components/Header";

export const Route = createFileRoute('/finished')({
  component: RouteComponent,
})

function RouteComponent() {
  const todos = useAppSelector(state => state.todos.todos);
  const titleRef = useRef<HTMLDivElement | null>(null);
  const finishedTodos = todos.filter(todo => todo.isCompleted);

  return (
    <div id="finished" className="flex flex-col items-start gap-4">
      <Header
        title="Finished tasks"
        titleRef={titleRef}
      />
      <h1 className="text-3xl font-black w-full" ref={titleRef}>Finished tasks</h1>
      {
        finishedTodos.length === 0 ?
          <h2 className="w-full">You don't have any finished tasks yet</h2>
          :
          <TodoList todos={finishedTodos} />
      }
    </div>
  )
}
