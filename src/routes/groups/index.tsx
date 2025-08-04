import { useRef, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router'
import { useAppSelector } from '../../redux/hooks';
import Header from '../../components/Header';
import NewGroupButton from '../../components/buttons/NewGroupButton';
import GroupCard from '../../components/groups/GroupCard';


export const Route = createFileRoute('/groups/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [currEditingTodoID, setCurrEditingTodoID] = useState<string>("");

  const groups = useAppSelector(state => state.groups.groups);
  const titleRef = useRef<HTMLDivElement | null>(null);

  return (
    <div id="groups" className="flex flex-col items-start gap-4">
      <Header
        title="My groups"
        titleRef={titleRef}
      />
      <h1 className="text-3xl pb-3 font-black w-full" ref={titleRef}>My groups</h1>
      {
        groups.length === 0 ?
          <h2 className="w-full">You don't have any groups yet</h2> :
          <ul className="flex flex-col items-start w-full">
            {groups.map(group =>
              <li className="w-full max-w-full text-lg overflow-hidden" key={group.id}>
                <GroupCard
                  group={group}
                  isEditing={currEditingTodoID === group.id}
                  setIsEditing={setCurrEditingTodoID}
                />
              </li>
            )}
          </ul>
      }
      <NewGroupButton />
    </div>
  )
}