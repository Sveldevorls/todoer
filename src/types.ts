export type TodoObject = {
    id: string;
    title: string;
    description: string | null;
    isCompleted: boolean;
}

export type EditorActionType = "" | "NEW_TODO" | "EDIT_TODO";