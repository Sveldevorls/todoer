import { createFileRoute } from '@tanstack/react-router'
import { useGroupsContext } from '../../contexts/GroupsContext/GroupsContext'
import { useTodosContext } from '../../contexts/TodosContext/TodosContext';
import type { GroupObject } from '../../types';
import Accordion from '../../components/Accordion';
import NewTodoEditor from '../../components/NewTodoEditor';
import TodoList from '../../components/TodoList';

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
  const { todos } = useTodosContext();
  const myGroupTodos = todos.filter(todo => todo.group === group.id);
  const myGroupFinishedTodos = myGroupTodos.filter(todo => todo.isCompleted);
  const myGroupOngoingTodos = myGroupTodos.filter(todo => !todo.isCompleted);

  if (myGroupTodos.length === 0) {
    return (
      <div id="group-page" className="flex flex-col items-start gap-4">
        <h1 className="text-3xl font-black break-all line-clamp-2">
          {group.title}
        </h1>
        <h2>This group is currently empty</h2>
        <NewTodoEditor defaultGroupID={group.id} />
      </div>
    )
  }

  return (
    <div id="group-page" className="flex flex-col items-start gap-4">
      <div className="w-full mb-2">
        <h1 className="text-3xl font-black break-all line-clamp-2">
          {group.title}
        </h1>
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