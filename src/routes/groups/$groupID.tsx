import { createFileRoute } from '@tanstack/react-router'
import { useGroupsContext } from '../../contexts/GroupsContext/GroupsContext'
import { useTodosContext } from '../../contexts/TodosContext/TodosContext';
import type { GroupObject } from '../../types';
import TodoCard from '../../components/TodoCard';
import Accordion from '../../components/Accordion';
import NewTodoEditor from '../../components/NewTodoEditor';

export const Route = createFileRoute('/groups/$groupID')({
  component: RouteComponent,
})

function RouteComponent() {
  const { groupID } = Route.useParams();
  const { groups } = useGroupsContext();
  const group = groups.find(group => group.id === groupID);

  return (
    <>
      {group === undefined ?
        <div>None</div> :
        <GroupPage
          group={group}
          key={groupID}
        />
      }
    </>
  )
}

function GroupPage({ group }: { group: GroupObject }) {
  const { todos } = useTodosContext();
  const myGroupTodos = todos.filter(todo => todo.group === group.id);
  const myGroupCompletedTodos = myGroupTodos.filter(todo => todo.isCompleted);
  const myGroupOngoingTodos = myGroupTodos.filter(todo => !todo.isCompleted);

  return (
    <div id="group-page" className="flex flex-col items-start gap-4 p-2">
      <div className="w-full pb-3">
        <h1 className="text-3xl font-black break-all line-clamp-2">
          {group.title}
        </h1>
        {
          myGroupTodos.length > 0 &&
            myGroupCompletedTodos.length === myGroupTodos.length ?
            <p>All tasks finished</p> :
            <p>{myGroupCompletedTodos.length} out of {myGroupTodos.length} task{myGroupTodos.length > 1 && "s"} finished</p>
        }
      </div>
      <div className="w-full flex flex-col gap-4">
        <Accordion
          title="Ongoing tasks"
          defaultOpen={true}
        >
          <div className="flex flex-col items-start gap-2">
            {myGroupOngoingTodos.length == 0 ?
              <p className="pt-2">
                You don't have any ongoing tasks in this gorup right now
              </p>
              :
              <>
                {myGroupOngoingTodos.map(todo =>
                  <TodoCard key={todo.id} todo={todo} />
                )}
              </>
            }
            <NewTodoEditor
              defaultGroupID={group.id}
            />
          </div>
        </Accordion>
        <Accordion
          title="Finished tasks"
        >
          <div className="flex flex-col items-start gap-2 pt-2">
            {myGroupCompletedTodos.length == 0 ?
              <p>
                You don't have any finished tasks right now
              </p>
              :
              <>
                {myGroupCompletedTodos.map(todo =>
                  <TodoCard key={todo.id} todo={todo} />
                )}
              </>
            }
          </div>
        </Accordion>
      </div>
    </div>
  )
}