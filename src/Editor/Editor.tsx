import type React from "react";
import { useEditorContext } from "../EditorContext/EditorContext";
import { useTodosContext } from "../TodosContext/TodosContext";
import type { TodoObject } from "../types";

export default function Editor() {
    const { editorRef, editorAction } = useEditorContext();

    /* function handleDialogClick(e: React.MouseEvent<HTMLDialogElement>): void {
        const clickedElement = e.target as HTMLElement;
        if (clickedElement.tagName === "DIALOG") {
            editorRef.current!.close();
        }
    } */

    return (
        <dialog
            ref={editorRef}
            /* onClick={(e) => handleDialogClick(e)} */
            className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2"
        >
            {{
                "NEW_TODO": <NewTodoTemplate />,
                "EDIT_TODO": <EditTodoTemplate />,
                "": <></>,
            }[editorAction]}
        </dialog>
    )
}

function NewTodoTemplate() {
    const { editorRef } = useEditorContext();
    const { todos, setTodos } = useTodosContext();

    function handleNewTodoSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const newTodo: TodoObject = {
            id: crypto.randomUUID(),
            title: data.get("title") as string,
            description: data.get("description") as string,
            isCompleted: data.get("status") === "true" ? true : false
        }
        setTodos([...todos, newTodo])

        editorRef.current!.close();
    }

    return (
        <div className="flex flex-col gap-4 p-8">
            <form id="new-todo" onSubmit={(e) => handleNewTodoSubmit(e)} className="flex flex-col gap-3">
                <label>
                    <h2>Title*</h2>
                    <input
                        type="text"
                        name="title"
                        className="border-1 border-black"
                        required
                    />
                </label>
                <label>
                    <h2>Description</h2>
                    <textarea
                        name="description"
                        className="border-1 border-black"
                    />
                </label>
                <div className="flex flex-col">
                    <h2>Status*</h2>
                    <label>
                        <input type="radio" name="status" value="false" />
                        Unfinished
                    </label>
                    <label>
                        <input type="radio" name="status" value="true" required />
                        Completed
                    </label>
                </div>
            </form>
            <button
                form="new-todo"
                className="bg-green-200"
            >
                Add todo
            </button>
            <button
                onClick={() => editorRef.current!.close()}
                className="bg-red-200"
            >
                Cancel
            </button>
        </div>
    )
}

function EditTodoTemplate() {
    return (
        <h1>Edit todo</h1>
    )
}