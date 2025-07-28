import { createFileRoute } from '@tanstack/react-router'
import { useGroupsContext } from '../../contexts/GroupsContext/GroupsContext'
import { useTodosContext } from '../../contexts/TodosContext/TodosContext';
import { useRef } from 'react';
import type { GroupObject } from '../../types';
import Accordion from '../../components/Accordion';
import TodoList from '../../components/TodoList';
import TextareaEditor from '../../components/TextareaEditor';
import Header from '../../components/Header';
import DeleteButton from '../../components/buttons/DeleteButton';
import NewTodoButton from '../../components/buttons/NewTodoButton';

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
  const { groups, setAndSaveGroups } = useGroupsContext();
  const titleRef = useRef<HTMLDivElement | null>(null);

  const myGroupTodos = todos.filter(todo => todo.group === group.id);
  const myGroupFinishedTodos = myGroupTodos.filter(todo => todo.isCompleted);
  const myGroupOngoingTodos = myGroupTodos.filter(todo => !todo.isCompleted);

  return (
    <div id="group-page">
      <div className="w-full mb-6">
        <Header
          title={group.title}
          titleRef={titleRef}
          rightButtons={[<DeleteButton type="group" id={group.id} />]}
        />
        <div className="w-full text-3xl font-black" ref={titleRef}>
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
          {
            myGroupFinishedTodos.length > 0 &&
            <div className="text-base font-normal">
              {
                myGroupFinishedTodos.length === myGroupTodos.length ?
                  <p>All tasks finished</p> :
                  <p>{myGroupFinishedTodos.length} out of {myGroupTodos.length} task{myGroupTodos.length > 1 && "s"} finished</p>
              }
            </div>
          }
        </div>
      </div>
      {
        myGroupTodos.length === 0 ?
          <div>
            <h2 className="mb-2">
              This group is currently empty
            </h2>
            <NewTodoButton defaultGroupID={group.id} />
          </div>
          :
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
                <NewTodoButton defaultGroupID={group.id} />
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
      }
    </div>
  )
}