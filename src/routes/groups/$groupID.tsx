import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useGroupsContext } from '../../contexts/GroupsContext/GroupsContext'
import { useTodosContext } from '../../contexts/TodosContext/TodosContext';
import type { GroupObject } from '../../types';
import Accordion from '../../components/Accordion';
import NewTodoEditor from '../../components/NewTodoEditor';
import TodoList from '../../components/TodoList';
import TextareaEditor from '../../components/TextareaEditor';
import { useConfirm } from '../../contexts/ConfirmContext/ConfirmContext';
import { useAlert } from '../../contexts/AlertContext/AlertContext';

export const Route = createFileRoute('/groups/$groupID')({
  component: RouteComponent,
})

function RouteComponent() {
  const { groupID } = Route.useParams();
  const { groups } = useGroupsContext();
  const group = groups.find(group => group.id === groupID);

  if (group === undefined) {
    return (
      <h1 className="text-3xl font-black">Group not found!</h1>
    )
  }

  return (
    <GroupPage
      group={group}
      key={groupID}
    />
  )
}

function GroupPage({ group }: { group: GroupObject }) {
  const { todos, setAndSaveTodos } = useTodosContext();
  const { groups, setAndSaveGroups } = useGroupsContext();
  const myGroupTodos = todos.filter(todo => todo.group === group.id);
  const myGroupFinishedTodos = myGroupTodos.filter(todo => todo.isCompleted);
  const myGroupOngoingTodos = myGroupTodos.filter(todo => !todo.isCompleted);
  const showConfirm = useConfirm();
  const showAlert = useAlert();
  const router = useRouter();

  function handleGroupDeleteClick() {
    showConfirm({
      message: "This action can not be reversed, and all tasks belonging to this group will become ungrouped. Are you sure?",
      cancelText: "Cancel",
      confirmText: "Yes, delete this group",
      onConfirm: () => {
        router.navigate({ to: "/" });
        showAlert({ message: "Group deleted" });
        setAndSaveTodos(todos.map(nextTodo => nextTodo.group === group.id ? { ...nextTodo, group: "" } : nextTodo))
        setAndSaveGroups(groups.filter(nextGroup => nextGroup.id != group.id))
      }
    })
  }

  if (myGroupTodos.length === 0) {
    return (
      <div id="group-page" className="flex flex-col items-start gap-4">
        <div className="w-full mb-2">
          <div className="flex justify-end items-center">
            <button
              className="button-svg bg-white rounded-md @lg:hidden"
              onClick={handleGroupDeleteClick}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
              </svg>
            </button>
            <button
              className="button-primary bg-red-500 w-[10em] @max-lg:hidden"
              onClick={handleGroupDeleteClick}
            >
              Delete this group
            </button>
          </div>
          <div className="w-full text-3xl font-black">
            <TextareaEditor
              value={group.title}
              required={true}
              blurHandler={(nextValue) => {
                setAndSaveGroups(groups.map(nextGroup => nextGroup.id === group.id ?
                  { ...group, title: nextValue } :
                  nextGroup
                ))
              }}
            />
          </div>
        </div>
        <h2>This group is currently empty</h2>
        <NewTodoEditor defaultGroupID={group.id} />
      </div>
    )
  }

  return (
    <div id="group-page" className="@container flex flex-col items-start gap-4">
      <div className="w-full mb-2">
        <div className="flex justify-end items-center">
          <button
            className="button-svg bg-white rounded-md @lg:hidden"
            onClick={handleGroupDeleteClick}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          </button>
          <button
            className="button-primary bg-red-500 w-[10em] @max-lg:hidden"
            onClick={handleGroupDeleteClick}
          >
            Delete this group
          </button>
        </div>
        <div className="w-full text-3xl font-black">
          <TextareaEditor
            value={group.title}
            required={true}
            blurHandler={(nextValue) => {
              setAndSaveGroups(groups.map(nextGroup => nextGroup.id === group.id ?
                { ...group, title: nextValue } :
                nextGroup
              ))
            }}
          />
        </div>
        {
          myGroupFinishedTodos.length === myGroupTodos.length ?
            <p>All tasks finished</p> :
            <p>{myGroupFinishedTodos.length} out of {myGroupTodos.length} task{myGroupTodos.length > 1 && "s"} finished</p>
        }
      </div>
      <div className="w-full flex flex-col gap-4">
        <Accordion
          title="Ongoing tasks"
          defaultOpen={true}
        >
          <div className="flex flex-col items-start gap-4">
            {myGroupOngoingTodos.length == 0 ?
              <p className="py-2">You don't have any ongoing tasks in this gorup right now</p> :
              <TodoList todos={myGroupOngoingTodos} />
            }
            <NewTodoEditor defaultGroupID={group.id} />
          </div>
        </Accordion>
        <Accordion
          title={`Finished tasks${myGroupFinishedTodos.length > 0 ? ` (${myGroupFinishedTodos.length})` : ""}`}
        >
          <div className="flex flex-col items-start gap-4">
            {myGroupFinishedTodos.length == 0 ?
              <p className="py-2">You don't have any finished tasks in this gorup right now</p> :
              <TodoList todos={myGroupFinishedTodos} />
            }
          </div>
        </Accordion>
      </div>
    </div>
  )
}