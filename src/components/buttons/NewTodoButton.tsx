import TodoEditor from "../todos/TodoEditor";

type NewTodoButtonProps = {
  isEditing: boolean;
  openHandler: VoidFunction;
  closeHandler: VoidFunction;
  defaultGroupID?: string;
  defaultDate?: string;
}

export default function NewTodoButton({
  isEditing, openHandler, closeHandler, defaultGroupID = "", defaultDate = ""
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