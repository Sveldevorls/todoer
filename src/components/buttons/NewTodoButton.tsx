import { useState } from "react"
import { QuickTodoEditor } from "../QuickTodoEditor";

export default function NewTodoButton({ defaultGroupID = "" }: { defaultGroupID?: string }) {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  if (isEditing) {
    return (
      <QuickTodoEditor
        mode="new"
        defaultGroupID={defaultGroupID}
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