import { useTodosContext } from "../TodosContext/TodosContext";
import type { TodoObject } from "../types";

import NewTodoEditor from "../NewTodoEditor/NewTodoEditor";

export default function Home() {
    const { todos } = useTodosContext();
    console.log(todos);

    return (
        <div id="home" className="flex flex-col items-center gap-4 text-center p-2">
            <h1 className="text-4xl font-black w-full">Home</h1>
            {
                todos.length === 0 ?
                    <h2 className="w-full">There are currently no todos</h2> :
                    <ul className="flex flex-col items-center w-full">
                        {todos.map(todo => <TodoCard todo={todo} key={todo.id} />)}
                    </ul>
            }
            <NewTodoEditor />
        </div>
    )
}

function TodoCard({ todo }: { todo: TodoObject }) {
    const { todos, setTodos } = useTodosContext();

    function handleTodoFinishClick() {
        const nextTodos = todos.map(nextTodo => 
            nextTodo.id === todo.id ? {...nextTodo, isCompleted: true} : nextTodo
        )

        setTodos(nextTodos);
    }

    return (
        <li className="flex items-center p-2 gap-3 w-[min(90vw,480px)] text-left border-b-gray-200 hover:bg-gray-100 border-b-1">
            <button
                className="w-[24px] h-[24px] p-0 rounded-full
                    border-2 border-gray-300 hover:border-green-500 
                    transition-colors 
                    flex items-center justify-center shrink-0 group"
                onClick={handleTodoFinishClick}
                title="Mark as finished"
            >
                <svg
                    className="w-[16px] h-[16px] stroke-green-500 opacity-0 duration-300 group-hover:opacity-100"
                    viewBox="0 0 24 24"
                >
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" fill="none" strokeWidth="3" />
                </svg>
            </button>
            <div className="min-w-0 flex-1">
                <h2 className="font-bold truncate">{todo.title}</h2>
                <p className="text-sm break-all line-clamp-2">{todo.description}</p>
                {todo.isCompleted && <h2>finished</h2> }
            </div>
        </li>
    )
}