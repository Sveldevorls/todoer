import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { TodoObject } from "../types";

interface TodosState {
  todos: TodoObject[];
}

const initialTodos = JSON.parse(localStorage.getItem("todos") ?? "[]");
const initialState: TodosState = {
  todos: initialTodos,
};

export const todosSlice = createSlice({
  name: "todos",
  initialState: initialState,
  reducers: {
    addTodo: (state: TodosState, action: PayloadAction<TodoObject>) => {
      state.todos.push(action.payload);
    },
    deleteTodo: (state: TodosState, action: PayloadAction<string>) => {
      state.todos = state.todos.filter((todo) => todo.id != action.payload);
    },
    updateTodoByField: <K extends keyof TodoObject>(
      state: TodosState,
      action: PayloadAction<{ id: string; key: K; value: TodoObject[K] }>
    ) => {
      const { id, key, value } = action.payload;
      const editedTodo = state.todos.find((todo) => todo.id === id);
      if (editedTodo) {
        editedTodo[key] = value;
      }
    },
  },
});

export const { addTodo, deleteTodo, updateTodoByField } = todosSlice.actions;
export default todosSlice.reducer;
