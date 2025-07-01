import type React from "react";
import { useEditorContext } from "../EditorContext/EditorContext";
import { useTodosContext } from "../TodosContext/TodosContext";
import type { TodoObject } from "../types";

export default function Editor() {
    const { editorRef, editorAction } = useEditorContext();

    function handleDialogClick(e: React.MouseEvent<HTMLDialogElement>): void {
        const clickedElement = e.target as HTMLElement;
        if (clickedElement.tagName === "DIALOG") {
            editorRef.current!.close();
        }
    }

    return (
        <dialog ref={editorRef} onClick={(e) => handleDialogClick(e)}>
            <div>
                {{
                    "NEW_TODO": <NewTodoTemplate />,
                    "EDIT_TODO": <EditTodoTemplate />,
                    "": <></>,
                }[editorAction]}
            </div>
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
        <div>
            <form id="new-todo" onSubmit={(e) => handleNewTodoSubmit(e)}>
                <label>
                    <h2>Title</h2>
                    <input type="text" name="title" required />
                </label>
                <label>
                    <h2>Description</h2>
                    <textarea name="description" />
                </label>
                <h2>Status</h2>
                <input type="radio" name="status" id="completed" value="true" required />
                <label htmlFor="completed">Completed</label>
                <input type="radio" name="status" id="unfinished" value="false" />
                <label htmlFor="unfinished">Unfinished</label>
            </form>
            <button form="new-todo">Add todo</button>
            <button onClick={() => editorRef.current!.close()}>Cancel</button>
        </div>
    )
}

function EditTodoTemplate() {
    return (
        <h1>Edit todo</h1>
    )
}