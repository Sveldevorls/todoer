import { createFileRoute } from '@tanstack/react-router'
import { useTodosContext } from '../../contexts/TodosContext/TodosContext';
import { useGroupsContext } from '../../contexts/GroupsContext/GroupsContext';
import { useAlert } from '../../contexts/AlertContext/AlertContext';
import type { TodoObject } from '../../types';
import TextareaEditor from '../../components/TextareaEditor';
import Select from '../../components/Select';
import Header from '../../components/Header';
import { useRef } from 'react';
import DeleteButton from '../../components/buttons/DeleteButton/DeleteButton';
import TodoToggleButton from '../../components/buttons/TodoToggleButton';
import GoBackButton from '../../components/buttons/GoBackButton';

export const Route = createFileRoute('/tasks/$taskID')({
  component: RouteComponent
})

function RouteComponent() {
  const { todos } = useTodosContext();
  const { taskID } = Route.useParams();
  const todo = todos.find(todo => todo.id === taskID);

  if (todo === undefined) {
    return (
      <h1 className="text-3xl font-black">Task not found!</h1>
    )
  }

  return (
    <TaskPage todo={todo} />
  )
}

function TaskPage({ todo }: { todo: TodoObject }) {
  const { todos, setAndSaveTodos } = useTodosContext();
  const { groups } = useGroupsContext();
  const showAlert = useAlert();
  const titleRef = useRef<HTMLDivElement | null>(null);

  function generateBlurHandler(key: string) {
    return (value: string) => {
      const nextTodos = todos.map(
        nextTodo => nextTodo.id === todo.id ?
          { ...todo, [key]: value } :
          nextTodo
      )
      setAndSaveTodos(nextTodos);
    }
  }

  return (
    <div id="task-page" className="flex flex-col gap-4 w-full">
      <div className="@container mb-4">
        <Header
          title={todo.title}
          titleRef={titleRef}
          leftButtons={[<GoBackButton />]}
          rightButtons={[<TodoToggleButton todo={todo} />, <DeleteButton type="todo" id={todo.id} />]}
        />
        <div className="flex">

        </div>
        <div className="text-3xl font-black" ref={titleRef}>
          <TextareaEditor
            value={todo.title}
            required={true}
            blurHandler={generateBlurHandler("title")}
          />
        </div>
        <h2>
          {todo.isCompleted ? "Finished" : "In progress"}
        </h2>
      </div>
      <div>
        <h3 className="mb-1 text-sm uppercase font-black border-b-1 border-gray-400">Group</h3>
        <Select
          options={groups.map(group => ({ label: group.title, value: group.id }))}
          defaultValue={todo.group == "" ? null : todo.group}
          selectHandler={
            (nextGroupID: string) => {
              const nextTodos = todos.map(nextTodo =>
                nextTodo.id === todo.id ?
                  { ...nextTodo, group: nextGroupID } :
                  nextTodo
              )
              setAndSaveTodos(nextTodos);
              showAlert({ message: "Task moved" })
            }
          }
        />
      </div>
      <div>
        <h3 className="text-sm uppercase font-black border-b-1 border-gray-400">Description</h3>
        <TextareaEditor
          value={todo.description}
          placeholder="Click here to add description"
          blurHandler={generateBlurHandler("description")}
        />
      </div>
      <div>
        <h3 className="text-sm uppercase font-black border-b-1 border-gray-400">Notes</h3>
        <TextareaEditor
          value={todo.notes}
          placeholder="Click here to add notes"
          blurHandler={generateBlurHandler("notes")}
        />
      </div>
    </div>
  )
}