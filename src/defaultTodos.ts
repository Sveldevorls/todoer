import type { TodoObject } from "./types";

const defaultTodos: TodoObject[] = [
  {
    id: crypto.randomUUID(),
    title: "Welcome to Todoer",
    description: "Click on a task to see its details",
    notes: "And tasks can have notes too",
    group: null,
    date: null,
    isCompleted: false,
  },
  {
    id: crypto.randomUUID(),
    title: "Click on the circle to mark a task as finished",
    description: "And click again to mark it as unfinished",
    notes: null,
    group: null,
    date: null,
    isCompleted: false,
  },
  {
    id: crypto.randomUUID(),
    title: "Try putting your todo into a group",
    description: "And give it a finish date too",
    notes: null,
    group: "956bfc31-4b05-47a2-a903-24727585a9ba",
    date: new Date().getTime(),
    isCompleted: false,
  },
];

export default defaultTodos;
