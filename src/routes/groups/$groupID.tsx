import { useRef } from 'react';
import { createFileRoute } from '@tanstack/react-router'
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { updateGroupTitle } from '../../redux/groupsSlice';
import type { GroupObject } from '../../types';
import Accordion from '../../components/Accordion';
import TodoList from '../../components/todos/TodoList';
import TextareaEditor from '../../components/TextareaEditor';
import Header from '../../components/Header';
import DeleteButton from '../../components/buttons/DeleteButton';
import NewTodoButton from '../../components/buttons/NewTodoButton';

export const Route = createFileRoute('/groups/$groupID')({
  component: RouteComponent,
})

function RouteComponent() {
  const { groupID } = Route.useParams();
  const groups = useAppSelector(state => state.groups.groups);
  const currGroup = groups.find(group => group.id === groupID);

  if (currGroup === undefined) {
    return (
      <h1 className="text-3xl font-black">Group not found!</h1>
    )
  }

  return (
    <GroupPage
      group={currGroup}
      key={groupID}
    />
  )
}

function GroupPage({ group }: { group: GroupObject }) {
  const titleRef = useRef<HTMLDivElement | null>(null);
  const todos = useAppSelector(state => state.todos.todos);
  const currGroupTodos = todos.filter(todo => todo.group === group.id);
  const currGroupOngoingTodos = currGroupTodos.filter(todo => !todo.isCompleted);
  const currGroupFinishedTodos = currGroupTodos.filter(todo => todo.isCompleted);
  const dispatch = useAppDispatch();

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
              dispatch(updateGroupTitle({ id: group.id, value: nextValue }))
            }}
          />
          {
            currGroupTodos.length > 0 &&
            <div className="text-base font-normal">
              {
                currGroupFinishedTodos.length === currGroupTodos.length ?
                  <p>All tasks finished</p> :
                  <p>{currGroupFinishedTodos.length} out of {currGroupTodos.length} task{currGroupTodos.length > 1 && "s"} finished</p>
              }
            </div>
          }
        </div>
      </div>
      {
        currGroupTodos.length === 0 ?
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
                {currGroupOngoingTodos.length == 0 ?
                  <p className="py-2">You don't have any ongoing tasks in this gorup right now</p> :
                  <TodoList todos={currGroupOngoingTodos} />
                }
                <NewTodoButton defaultGroupID={group.id} />
              </div>
            </Accordion>
            <Accordion
              title={`Finished tasks${currGroupFinishedTodos.length > 0 ? ` (${currGroupFinishedTodos.length})` : ""}`}
            >
              <div className="flex flex-col items-start gap-4">
                {currGroupFinishedTodos.length == 0 ?
                  <p className="py-2">You don't have any finished tasks in this gorup right now</p> :
                  <TodoList todos={currGroupFinishedTodos} />
                }
              </div>
            </Accordion>
          </div>
      }
    </div>
  )
}