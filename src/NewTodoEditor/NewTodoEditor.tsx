import React, { useRef, useState } from "react";
import { useConfirm } from "../contexts/ConfirmContext/ConfirmContext";
import { useTodosContext } from "../contexts/TodosContext/TodosContext";
import type { TodoObject } from "../types";
import TextareaAutosize from 'react-textarea-autosize';

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
  const formRef = useRef<HTMLFormElement | null>(null);
  const { todos, setTodos } = useTodosContext();
  const showConfirm = useConfirm();

  function handleNewTodoFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const data = new FormData(formRef.current!);
    const newTodo: TodoObject = {
      id: crypto.randomUUID(),
      title: data.get("title") as string,
      description: data.get("description") as string,
      isCompleted: false,
    };

    setTodos([...todos, newTodo]);
    formRef.current!.reset();
  }

  function handleNewTodoFormCancel() {
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
    <div className="border-1 border-gray-400 rounded-md w-[min(90vw,30em)] flex flex-col gap-4 p-2">
      <form
        className="flex flex-col"
        id="new-todo-form"
        onSubmit={e => handleNewTodoFormSubmit(e)}
        ref={formRef}
      >
        <input
          type="text"
          name="title"
          className="font-bold focus:outline-0 focus:bg-gray-100"
          placeholder="Title"
          required
        />
        <TextareaAutosize
          name="description"
          className="resize-none text-sm focus:outline-0 focus:bg-gray-100"
          placeholder="Description (optional)"
          minRows={3}
          maxRows={5}
        />
      </form>
      <div className="flex justify-end gap-4">
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