import { useRef } from 'react';
import { createFileRoute } from '@tanstack/react-router'
import { useAppSelector } from '../redux/hooks';
import type { TodoObject } from '../types';
import Header from '../components/Header';
import TodoList from '../components/todos/TodoList';
import NewTodoButton from '../components/buttons/NewTodoButton';

export const Route = createFileRoute('/today')({
  component: RouteComponent,
})

function RouteComponent() {
  const todos = useAppSelector(state => state.todos.todos);
  const titleRef = useRef<HTMLDivElement | null>(null);
  const todayOngoingTodos = todos.filter(todo => todoDateIsToday(todo) && !todo.isCompleted)

  function todoDateIsToday(todo: TodoObject) {
    if (!todo.date) return false;

    const today = new Date();
    const todoDate = new Date(parseInt(todo.date, 10));
    return (
      todoDate.getDay() === today.getDay() &&
      todoDate.getMonth() === today.getMonth() &&
      todoDate.getFullYear() === today.getFullYear()
    )
  }

  return (
    <div id="today" className="flex flex-col items-start gap-4">
      <Header
        title="Today"
        titleRef={titleRef}
      />
      <div>
        <h1 className="text-3xl font-black w-full" ref={titleRef}>Today</h1>
        {
          todayOngoingTodos.length > 0 &&
          <p>{todayOngoingTodos.length} task{todayOngoingTodos.length > 1 && "s"}</p>
        }
      </div>
      {
        todayOngoingTodos.length === 0 ?
          <h2 className="w-full">You don't have any tasks today</h2> :
          <TodoList todos={todayOngoingTodos} />
      }
      <NewTodoButton
        defaultDate={new Date().getTime().toString()}
      />
    </div>
  )
}
