import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useTodosContext } from '../../contexts/TodosContext/TodosContext';
import { useGroupsContext } from '../../contexts/GroupsContext/GroupsContext';
import { useAlert } from '../../contexts/AlertContext/AlertContext';
import { useConfirm } from '../../contexts/ConfirmContext/ConfirmContext';
import type { TodoObject } from '../../types';
import TextareaEditor from '../../components/TextareaEditor';
import Select from '../../components/Select';

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
  const showConfirm = useConfirm();
  const router = useRouter();

  function handleTodoFinishClick() {
    const nextTodos = todos.map(nextTodo =>
      nextTodo.id === todo.id ? { ...nextTodo, isCompleted: true } : nextTodo
    )
    showAlert({ message: "Task completed" });
    setAndSaveTodos(nextTodos);
  }

  function handleTodoRestartClick() {
    const nextTodos = todos.map(nextTodo =>
      nextTodo.id === todo.id ? { ...nextTodo, isCompleted: false } : nextTodo
    )
    showAlert({ message: "Task restarted" });
    setAndSaveTodos(nextTodos);
  }

  function handleTodoDeleteClick() {
    function deleteTodo() {
      const hasPrevRoute = router.history.canGoBack();
      if (hasPrevRoute) {
        router.history.back();
      }
      else {
        router.navigate({ to: "/" });
      }

      setTimeout(() => {
        showAlert({ message: "Task deleted" });
        setAndSaveTodos(todos.filter(nextTodo => nextTodo.id != todo.id));
      }, 0);
    }

    showConfirm({
      message: "This action can not be reversed. Are you sure?",
      cancelText: "Cancel",
      confirmText: "Yes, delete this task",
      onConfirm: deleteTodo,
    })
  }

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
        <div className="flex">
          <button className="button-svg bg-white rounded-md mr-auto" onClick={() => router.history.back()}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="10 18 4 12 10 6" />
              <line x1="4" y1="12" x2="19" y2="12" />
            </svg>
          </button>
          <div className="flex gap-2 @lg:hidden">
            <button
              className="button-svg bg-white rounded-md stroke-black"
              onClick={todo.isCompleted ? handleTodoRestartClick : handleTodoFinishClick}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" strokeWidth="1.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                {todo.isCompleted ?
                  <polyline points="8,16 16,8 12,12 8,8 16,16" fill="none" /> :
                  <polyline points="6.5,12 10.5,16 16.5,9" fill="none" />}
              </svg>
            </button>
            <button
              className="button-svg bg-white rounded-md"
              onClick={handleTodoDeleteClick}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
              </svg>
            </button>
          </div>
          <div className="flex gap-4 @max-lg:hidden h-[32px]">
            <button
              className="button-secondary"
              onClick={todo.isCompleted ? handleTodoRestartClick : handleTodoFinishClick}
            >
              {todo.isCompleted ? "Mark as ongoing" : "Mark as finished"}
            </button>
            <button
              className="button-primary bg-red-500 w-[10em]"
              onClick={handleTodoDeleteClick}
            >
              Delete this task
            </button>
          </div>
        </div>
        <div className="text-3xl font-black">
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