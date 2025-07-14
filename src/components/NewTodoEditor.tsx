import React, { useState } from "react";
import { useConfirm } from "../contexts/ConfirmContext/ConfirmContext";
import { useTodosContext } from "../contexts/TodosContext/TodosContext";
import type { TodoObject } from "../types";
import TextareaAutosize from 'react-textarea-autosize';
import { useGroupsContext } from "../contexts/GroupsContext/GroupsContext";

export default function NewTodoEditor() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      {
        isOpen ?
          <NewTodoForm closeHandler={() => setIsOpen(false)} /> :
          <NewTodoButton clickHandler={() => setIsOpen(true)} />
      }
    </>
  )
}

function NewTodoButton({ clickHandler }: { clickHandler: VoidFunction }) {
  return (
    <button
      onClick={clickHandler}
      className="button-primary"
    >
      + Add todo
    </button>
  )
}

function NewTodoForm({ closeHandler }: { closeHandler: VoidFunction }) {
  const { todos, setAndSaveTodos } = useTodosContext();
  const showConfirm = useConfirm();

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [group, setGroup] = useState<string>("");

  function handleNewTodoFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const newTodo: TodoObject = {
      id: crypto.randomUUID(),
      title: title,
      description: description,
      group: group,
      isCompleted: false,
    };

    setAndSaveTodos([...todos, newTodo]);
    setTitle("");
    setDescription("");
    setGroup("");
  }

  function handleNewTodoFormCancel() {
    const formFields = [title, description]
    if (formFields.some(field => field != "")) {
      showConfirm({
        message: "You will lose all unsaved progress if you exit. Are you sure?",
        cancelText: "Cancel",
        confirmText: "Yes, exit",
        onConfirm: closeHandler,
      });
    }
    else {
      closeHandler();
    }
  }

  return (
    <div className="border-1 border-gray-400 rounded-md w-full flex flex-col gap-4 p-2">
      <form
        className="flex flex-col"
        id="new-todo-form"
        onSubmit={e => handleNewTodoFormSubmit(e)}
      >
        <input
          type="text"
          name="title"
          className="font-bold focus:outline-0 focus:bg-gray-100"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.currentTarget.value)}
          required
        />
        <TextareaAutosize
          name="description"
          className="resize-none text-sm focus:outline-0 focus:bg-gray-100"
          placeholder="Description (optional)"
          minRows={3}
          maxRows={5}
          value={description}
          onChange={e => setDescription(e.currentTarget.value)}
        />
      </form>
      <GroupSelect
        currentGroup={group}
        selectHandler={setGroup}
      />
      <div className="flex justify-start gap-4 border-t-1 border-gray-400 pt-2">
        <button
          className="button-secondary"
          onClick={handleNewTodoFormCancel}
        >
          Cancel
        </button>
        <button
          form="new-todo-form"
          className="button-primary"
        >
          Add todo
        </button>
      </div>
    </div>
  )
}

type GroupSelectProps = {
  currentGroup: string,
  selectHandler: React.Dispatch<React.SetStateAction<string>>,
}

function GroupSelect({ currentGroup, selectHandler }: GroupSelectProps) {
  const { groups } = useGroupsContext();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div>
      <button
        className="button-primary bg-blue-500 truncate max-w-[12em]"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        {
          currentGroup === "" ?
            "+ Add to group" :
            groups.filter(group => group.id === currentGroup)[0].title
        }
      </button>
      {
        isOpen &&
        <div>
          <div className="fixed inset-0 h-screen w-screen bg-white/0" onClick={() => setIsOpen(!isOpen)}></div>
          <ul className="absolute z-1 max-w-[12em] bg-white border-gray-400 border-1 shadow rounded-md ">
            {groups.map(group =>
              <li
                key={group.id}
                className="hover:bg-gray-100 rounded-md"
                onClick={() => {
                  selectHandler(group.id);
                  setIsOpen(!isOpen);
                }}
              >
                <button className="flex py-1 w-full">
                  <svg width="24" height="24" viewBox="0 0 24 24" className="fill-gray-700 shrink-0">
                    <circle cx="12" cy="12" r="2.5" />
                  </svg>
                  <div className="truncate">{group.title}</div>
                </button>
              </li>
            )}
          </ul>
        </div>
      }
    </div>

  )
}