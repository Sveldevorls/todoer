import { useRef, useState, type ReactNode,} from "react";
import { EditorContext } from "./EditorContext";
import { type EditorActionType } from "../types";

export default function EditorContextProvider({ children }: { children: ReactNode }) {
    const editorRef = useRef<HTMLDialogElement|null>(null);
    const [editorAction, setEditorAction] = useState<EditorActionType>("");
    return (
        <EditorContext.Provider value={{ editorRef, editorAction, setEditorAction }}>
            {children}
        </EditorContext.Provider>
    )
}