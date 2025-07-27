import React, { useState, useRef } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router'
import { useGroupsContext } from '../../contexts/GroupsContext/GroupsContext'
import { useConfirm } from '../../contexts/ConfirmContext/ConfirmContext';
import type { GroupObject } from '../../types';
import Header from '../../components/Header';

export const Route = createFileRoute('/groups/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { groups } = useGroupsContext();
  const titleRef = useRef<HTMLDivElement | null>(null);

  return (
    <div id="groups" className="flex flex-col items-start gap-4">
      <Header
        title="My groups"
        titleRef={titleRef}
      />
      <h1 className="text-4xl pb-3 font-black w-full" ref={titleRef}>My groups</h1>
      {
        groups.length === 0 ?
          <h2 className="w-full">You don't have any groups yet</h2> :
          <div className="w-full">
            <ul className="flex flex-col gap-2 items-start w-full">
              {groups.map(group =>
                <li
                  key={group.id}
                  className="w-full max-w-full text-xl overflow-hidden"
                >
                  <Link
                    to="/groups/$groupID"
                    params={{ groupID: group.id }}
                    className="p-2 block border-b border-b-gray-200 hover:bg-gray-100 truncate w-full"
                  >
                    {group.title}
                  </Link>
                </li>
              )}
            </ul>
          </div>
      }
      {
        isOpen ?
          <NewGroupForm closeHandler={() => setIsOpen(false)} /> :
          <NewGroupButton clickHandler={() => setIsOpen(true)} />
      }
    </div>
  )
}

function NewGroupButton({ clickHandler }: { clickHandler: VoidFunction }) {
  return (
    <button
      className="button-primary"
      onClick={clickHandler}
    >
      + Add new group
    </button>
  )
}

function NewGroupForm({ closeHandler }: { closeHandler: VoidFunction }) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const { groups, setAndSaveGroups } = useGroupsContext();
  const showConfirm = useConfirm();

  function handleNewGroupFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const data = new FormData(formRef.current!);
    const newGroup: GroupObject = {
      id: crypto.randomUUID(),
      title: data.get("title") as string,
    };

    setAndSaveGroups([...groups, newGroup]);
    formRef.current!.reset();
  }

  function handleNewGroupFormCancel() {
    const data = new FormData(formRef.current!);
    let formIsEmpty: boolean = true;

    for (const value of data.values()) {
      if (value != "") {
        formIsEmpty = false;
      }
    }

    if (formIsEmpty) {
      closeHandler();
    }
    else {
      showConfirm({
        message: "You will lose all unsaved progress if you exit. Are you sure?",
        cancelText: "Cancel",
        confirmText: "Yes, exit",
        onConfirm: closeHandler,
      })
    }
  }

  return (
    <div className="border-1 border-gray-400 rounded-md w-full flex flex-col gap-4 p-2">
      <form
        className="flex flex-col"
        id="new-group-form"
        ref={formRef}
        onSubmit={(e) => handleNewGroupFormSubmit(e)}
      >
        <input
          type="text"
          name="title"
          className="font-bold text-lg focus:outline-0 focus:bg-gray-100"
          placeholder="Title"
          required
        />
      </form>
      <div className="flex justify-start gap-4">
        <button
          className="button-secondary"
          onClick={handleNewGroupFormCancel}
        >
          Cancel
        </button>
        <button
          form="new-group-form"
          className="button-primary"
        >
          Add new group
        </button>
      </div>
    </div>
  )
}