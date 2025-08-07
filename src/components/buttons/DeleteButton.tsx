import { useRouter } from "@tanstack/react-router";
import { useSnackbar } from "../../contexts/SnackbarContext/SnackbarContext";
import { useConfirm } from "../../contexts/ConfirmContext/ConfirmContext";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { deleteTodo } from "../../redux/todosSlice";
import { deleteGroup } from "../../redux/groupsSlice";
import DeleteIcon from "../icons/DeleteIcon";

type DeleteButtonProps = {
  type: "group" | "todo";
  id: string;
  redir?: boolean;
}

export default function DeleteButton({ type, id, redir = true }: DeleteButtonProps) {
  const todos = useAppSelector(state => state.todos.todos);
  const router = useRouter();
  const showSnackbar = useSnackbar();
  const showConfirm = useConfirm();
  const dispatch = useAppDispatch();

  function handleDeleteClick() {
    function redirect() {
      const hasPrevRoute = router.history.canGoBack();
      if (hasPrevRoute) {
        router.history.back();
      }
      else {
        router.navigate({ to: "/" });
      }
    }

    if (type === "group") {
      showConfirm({
        title: "Delete this group?",
        message: "Deleting this group will also delete all tasks belonging to the group. Are you sure?",
        cancelText: "Cancel",
        confirmText: "Yes, delete this group",
        onConfirm: () => {
          const todosToDelete = todos.filter(todo => todo.group === id);
          for (const todo of todosToDelete) {
            dispatch(deleteTodo(todo.id))
          }
          dispatch(deleteGroup(id));
          showSnackbar({ message: "Group deleted" });

          if (redir) {
            redirect();
          }
        }
      })
    }
    else {
      showConfirm({
        title: "Delete this task?",
        message: "This action can not be reversed. Are you sure?",
        cancelText: "Cancel",
        confirmText: "Yes, delete this task",
        onConfirm: () => {
          setTimeout(() => {
            showSnackbar({ message: "Task deleted" });
            dispatch(deleteTodo(id))
          }, 0);
          if (redir) {
            redirect();
          }
        },
      })
    }
  }

  return (
    <button
      className="button-svg"
      onClick={handleDeleteClick}
    >
      <DeleteIcon />
    </button>
  )
}