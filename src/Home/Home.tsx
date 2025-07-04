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
                    <h2 className="w-full">No todos yet</h2> :
                    <div className="flex flex-col gap-2 w-full">
                        {todos.map(todo => <TodoCard todo={todo} key={todo.id} />)}
                    </div>
            }
            <NewTodoEditor/>
        </div>
    )
}

function TodoCard({ todo }: { todo: TodoObject }) {
    const background = todo.isCompleted ? "bg-green-200" : "bg-red-200";

    return (
        <div className={`p-4 ${background}`}>
            <h2 className="text-2xl font-bold">{todo.title}</h2>
            <h3>{todo.description}</h3>
        </div>
    )
}