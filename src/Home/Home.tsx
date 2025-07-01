import { useEditorContext } from "../EditorContext/EditorContext";
import { useTodosContext } from "../TodosContext/TodosContext";
import type { TodoObject } from "../types";

export default function Home() {
    const { editorRef, setEditorAction } = useEditorContext();
    const { todos } = useTodosContext();

    console.log(todos);

    function handleAddTodoClick(): void {
        setEditorAction("NEW_TODO");
        editorRef.current?.showModal();
    }

    return (
        <div id="home">
            <h1>Todo list</h1>
            {
                todos.length === 0 ?
                    <h2>No todos yet</h2> :
                    todos.map(todo => <TodoCard todo={todo} />)
            }
            <button onClick={handleAddTodoClick}>
                Add todo
            </button>
        </div>
    )
}

function TodoCard({ todo }: { todo: TodoObject }) {
    return (
        <div>
            <h2>{todo.title}</h2>
            <h3>{todo.description}</h3>
        </div>
    )
}