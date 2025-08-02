import { useState } from "react"
import { QuickTodoEditor } from "../QuickTodoEditor";

type NewTodoButtonProps = {
  defaultGroupID?: string;
  defaultDate?: string;
}

export default function NewTodoButton({ defaultGroupID = "", defaultDate = "" }: NewTodoButtonProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  if (isEditing) {
    return (
      <QuickTodoEditor
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