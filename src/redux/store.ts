import {
  configureStore,
  createListenerMiddleware,
  isAnyOf,
} from "@reduxjs/toolkit";
import todosReducer, {
  addTodo,
  deleteTodo,
  updateTodoByField,
} from "./todosSlice";
import groupsReducer, {
  addGroup,
  deleteGroup,
  updateGroupTitle,
} from "./groupsSlice";

const todosListener = createListenerMiddleware();
const groupsListener = createListenerMiddleware();

todosListener.startListening({
  matcher: isAnyOf(addTodo, deleteTodo, updateTodoByField),
  effect: (action, listenerApi) => {
    localStorage.setItem(
      "todos",
      JSON.stringify((listenerApi.getState() as RootState).todos.todos)
    );
  },
});

groupsListener.startListening({
  matcher: isAnyOf(addGroup, deleteGroup, updateGroupTitle),
  effect: (action, listenerApi) => {
    localStorage.setItem(
      "groups",
      JSON.stringify((listenerApi.getState() as RootState).groups.groups)
    );
  },
});

export const store = configureStore({
  reducer: {
    todos: todosReducer,
    groups: groupsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(
      todosListener.middleware,
      groupsListener.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
