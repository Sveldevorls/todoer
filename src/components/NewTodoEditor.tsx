import React, { useState } from "react";
import { useConfirm } from "../contexts/ConfirmContext/ConfirmContext";
import { useTodosContext } from "../contexts/TodosContext/TodosContext";
import type { TodoObject } from "../types";
import TextareaAutosize from 'react-textarea-autosize';
import { useGroupsContext } from "../contexts/GroupsContext/GroupsContext";
import Select from "./Select";

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
      notes: "",
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