import React, { useEffect, useRef, useState } from "react";
import { useConfirm } from "../contexts/ConfirmContext/ConfirmContext";
import { useTodosContext } from "../contexts/TodosContext/TodosContext";
import type { TodoObject } from "../types";
import TextareaAutosize from 'react-textarea-autosize';
import { useGroupsContext } from "../contexts/GroupsContext/GroupsContext";

type NewTodoEditorProps = {
  defaultGroupID?: string | null,
}

export default function NewTodoEditor({ defaultGroupID = null }: NewTodoEditorProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="w-full">
      {
        isOpen ?
          <NewTodoForm
            closeHandler={() => setIsOpen(false)}
            defaultGroupID={defaultGroupID}
          /> :
          <button onClick={() => setIsOpen(true)} className="button-primary">
            + Add todo
          </button>
      }
    </div>
  )
}

type NewTodoFormProps = {
  defaultGroupID?: string | null,
  closeHandler: VoidFunction,
}

function NewTodoForm({ defaultGroupID = null, closeHandler }: NewTodoFormProps) {
  const { todos, setAndSaveTodos } = useTodosContext();
  const { groups } = useGroupsContext();
  const showConfirm = useConfirm();

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [group, setGroup] = useState<string | null>(defaultGroupID);

  function handleNewTodoFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const newTodo: TodoObject = {
      id: crypto.randomUUID(),
      title: title,
      description: description,
      group: typeof group == typeof null ? "" : group!,
      isCompleted: false,
    };

    setAndSaveTodos([...todos, newTodo]);

    setTitle("");
    setDescription("");
    if (group != defaultGroupID) {
      // reset group selection to default value current select group is not default
      setGroup(defaultGroupID);
    }
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
    <div className="border-1 border-gray-400 rounded-md w-full flex flex-col gap-2 p-2">
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
          autoFocus
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

      <Select
        options={groups.map(group => ({ label: group.title, value: group.id }))}
        defaultValue={group}
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

type SelectOption = {
  label: string,
  value: string,
}

type SelectProps = {
  options: SelectOption[],
  defaultValue?: string | null,
  selectHandler: (value: string) => void,
}

function Select({ options, defaultValue = null, selectHandler }: SelectProps) {
  const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<SelectOption | null>(options.find(option => option.value === defaultValue) ?? null);
  const optionsListRef = useRef<HTMLUListElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const newSelected = options.find(option => option.value === defaultValue) ?? null;
    setSelectedOption(newSelected);
  }, [defaultValue]);

  useEffect(() => {
    if (optionsListRef.current) {
      const { top, left, bottom } = buttonRef.current!.getBoundingClientRect();

      // default position - beneath button
      if (optionsListRef.current.clientHeight + bottom < window.innerHeight) {
        optionsListRef.current.style.top = `${bottom}px`;
        optionsListRef.current.style.left = `${left}px`;
      }
      // second preference - above button if not enough space below
      else if (top - optionsListRef.current.clientHeight >= 0) {
        optionsListRef.current.style.bottom = `${window.innerHeight - top}px`;
        optionsListRef.current.style.left = `${left}px`;
      }
      // final resort - vertically aligned in the center of the screen
      else {
        optionsListRef.current.style.top = `${(window.innerHeight - optionsListRef.current.clientHeight) / 2}px`;
        optionsListRef.current.style.left = `${left}px`;
      }
    }
  }, [menuIsOpen])

  return (
    <div>
      <button
        className="button-primary bg-blue-500 w-fit max-w-[12em] truncate"
        onClick={() => setMenuIsOpen(!menuIsOpen)}
        ref={buttonRef}
      >
        {selectedOption ? <span>{selectedOption.label}</span> : <span>Add to group</span>}
      </button>
      {
        menuIsOpen &&
        <div>
          <ul className="py-1 max-w-[200px] max-h-[200px] overflow-y-auto scrollbar-thin rounded-md shadow-[0_1px_5px_0px_#00000088] bg-white absolute z-1" ref={optionsListRef}>
            {options.map(option =>
              <li
                className={`p-1 pl-2 truncate cursor-pointer hover:bg-zinc-200
                  ${selectedOption?.value === option.value && "bg-blue-100"}
                  `}
                onClick={() => {
                  setSelectedOption(option);
                  selectHandler(option.value);
                  setMenuIsOpen(!menuIsOpen);
                }}
                key={option.value}>
                {option.label}
              </li>
            )}
          </ul>
          <div className="fixed inset-0" onClick={() => setMenuIsOpen(!menuIsOpen)} ></div>
        </div>
      }
    </div>
  )
}