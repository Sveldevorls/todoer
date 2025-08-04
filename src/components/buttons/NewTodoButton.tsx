import { useState } from "react"
import TodoEditor from "../todos/TodoEditor";

type NewTodoButtonProps = {
  defaultGroupID?: string;
  defaultDate?: string;
}

export default function NewTodoButton({ defaultGroupID = "", defaultDate = "" }: NewTodoButtonProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  if (isEditing) {
    return (
      <TodoEditor
        mode="new"
        defaultGroupID={defaultGroupID}
        defaultDate={defaultDate}
        closeHandler={() => setIsEditing(false)}
      />
    )
  }

  return (
    <button
      className="button-primary"
      onClick={() => setIsEditing(true)}
    >
      +Add todo
    </button>
  )
}