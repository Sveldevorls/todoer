import TodoEditor from "../todos/TodoEditor";

type NewTodoButtonProps = {
  isEditing: boolean;
  openHandler: VoidFunction;
  closeHandler: VoidFunction;
  defaultGroupID?: string | null;
  defaultDate?: number | null;
}

export default function NewTodoButton({
  isEditing, openHandler, closeHandler, defaultGroupID = null, defaultDate = null
}: NewTodoButtonProps) {
  if (isEditing) {
    return (
      <TodoEditor
        mode="new"
        defaultGroupID={defaultGroupID}
        defaultDate={defaultDate}
        closeHandler={closeHandler}
      />
    )
  }

  return (
    <button
      className="button-primary"
      onClick={openHandler}
    >
      +Add todo
    </button>
  )
}