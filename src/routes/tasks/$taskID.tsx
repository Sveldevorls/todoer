import { useRef } from 'react';
import { createFileRoute } from '@tanstack/react-router'
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { updateTodoByField } from '../../redux/todosSlice';
import { useAlert } from '../../contexts/AlertContext/AlertContext';
import type { TodoObject } from '../../types';
import TextareaEditor from '../../components/TextareaEditor';
import Select from '../../components/Select';
import Header from '../../components/Header';
import DeleteButton from '../../components/buttons/DeleteButton';
import TodoToggleButton from '../../components/buttons/TodoToggleButton';
import GoBackButton from '../../components/buttons/GoBackButton';
import DateSelector from '../../components/DateSelector';

export const Route = createFileRoute('/tasks/$taskID')({
  component: RouteComponent
})

function RouteComponent() {
  const { taskID } = Route.useParams();
  const todos = useAppSelector(state => state.todos.todos);
  const currTodo = todos.find(todo => todo.id === taskID);

  if (currTodo === undefined) {
    return (
      <h1 className="text-3xl font-black">Task not found!</h1>
    )
  }

  return (
    <TaskPage todo={currTodo} />
  )
}

function TaskPage({ todo }: { todo: TodoObject }) {
  const dispatch = useAppDispatch();
  const groups = useAppSelector(state => state.groups.groups);
  const showAlert = useAlert();
  const titleRef = useRef<HTMLDivElement | null>(null);

  function generateBlurHandler(key: keyof TodoObject) {
    return <K extends keyof TodoObject>(value: TodoObject[K]) => {
      dispatch(updateTodoByField({ id: todo.id, key: key, value: value }))
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
      <div className="flex flex-wrap gap-4">
        <div className="min-w-[200px] flex-grow">
          <h3 className="mb-1 text-sm uppercase font-black border-b-1 border-gray-400">Group</h3>
          <Select
            options={groups.map(group => ({ label: group.title, value: group.id }))}
            defaultValue={todo.group == "" ? null : todo.group}
            selectHandler={
              (nextGroupID: string) => {
                dispatch(updateTodoByField({ id: todo.id, key: "group", value: nextGroupID }));
                showAlert({ message: "Task moved" })
              }
            }
          />
        </div>
        <div className="min-w-[200px] flex-grow">
          <h3 className="mb-1 text-sm uppercase font-black border-b-1 border-gray-400">Date</h3>
          <DateSelector
            defaultDate={todo.date == "" ? null : new Date(parseInt(todo.date, 10))}
            changeHandler={(value) => {
              dispatch(updateTodoByField({ id: todo.id, key: "date", value: value }));
              showAlert({ message: "Date updated" })
            }}
          />
        </div>
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