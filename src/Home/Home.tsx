import { useTodosContext } from "../TodosContext/TodosContext";
import type { TodoObject } from "../types";

export default function Home() {
    const { todos, setTodos } = useTodosContext();
    
    function handleAddTodoClick() : void {
        const newTodo : TodoObject = {
            id: crypto.randomUUID(),
            title: "Title",
            description: "Description",
            isCompleted: false
        }

        setTodos([...todos, newTodo]);
    }

    return (
        <div id="home">
            <h1>Hello world</h1>
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