import React, { useRef, useState } from "react";
import { useConfirm } from "../ConfirmContext/ConfirmContext";
import { useTodosContext } from "../TodosContext/TodosContext";
import type { TodoObject } from "../types";

export default function NewTodoEditor() {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    function handleEditorClose() {
        setIsOpen(false);
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="border-solid border-black border-1 px-4 py-1 bg-white"
            >
                Add todo
            </button>
            {
                isOpen && <NewTodoForm closeHandler={handleEditorClose} />
            }
        </>
    )
}

function NewTodoForm({ closeHandler }: { closeHandler: VoidFunction }) {
    const formRef = useRef<HTMLFormElement | null>(null);
    const { todos, setTodos } = useTodosContext();
    const confirm = useConfirm();

    function handleNewTodoFormSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const data = new FormData(formRef.current!);
        const newTodo: TodoObject = {
            id: crypto.randomUUID(),
            title: data.get("title") as string,
            description: data.get("description") as string,
            isCompleted: false,
        };

        setTodos([newTodo, ...todos]);
        closeHandler();
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
            confirm({
                message: "You will lose all unsaved progress if you exit. Are you sure?",
                cancelText: "Cancel",
                confirmText: "Yes, exit",
                onConfirm: closeHandler,
            })
        }
    }

    return (
        <div className="border-1 border-black rounded-md">
            <form
                className="flex flex-col"
                id="new-todo-form"
                onSubmit={e => handleNewTodoFormSubmit(e)}
                ref={formRef}
            >
                <input type="text" name="title" className="border-b-1 border-black" required/>
                <textarea name="description" className="border-b-1 border-black resize-none" />
            </form>
            <button
                className="border-solid border-black border-1 px-4 py-1 bg-white"
                onClick={handleNewTodoFormCancel}
            >
                Cancel
            </button>
            <button
                form="new-todo-form"
                className="border-solid border-black border-1 px-4 py-1 bg-white"
            >
                Add todo
            </button>
        </div>
    )
}