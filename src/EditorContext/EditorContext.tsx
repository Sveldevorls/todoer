import React, { createContext, useContext, type RefObject } from "react";
import { type EditorActionType } from "../types";

interface EditorContextValue {
    editorRef: RefObject<HTMLDialogElement | null>;
    editorAction: EditorActionType;
    setEditorAction: React.Dispatch<React.SetStateAction<EditorActionType>>;
}

export const EditorContext = createContext<EditorContextValue | null>(null);

export function useEditorContext() {
    const currentEditorContext = useContext(EditorContext);
    if (!currentEditorContext) {
        throw new Error(
            "EditorContext is null: is the component calling the context not in EditorContextProvider?"
        );
    }

    return currentEditorContext;
}