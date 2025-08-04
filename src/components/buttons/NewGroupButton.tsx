import { useState } from "react";
import GroupEditor from "../GroupEditor";

export default function NewGroupButton() {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  if (isEditing) {
    return (
      <GroupEditor
        mode="new"
        closeHandler={() => setIsEditing(false)}
      />
    )
  }

  return (
    <button
      className="button-primary"
      onClick={() => setIsEditing(true)}
    >
      +Add group
    </button>
  )
}