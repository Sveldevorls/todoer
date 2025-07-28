import { useRouter } from "@tanstack/react-router";
import { useGroupsContext } from "../../contexts/GroupsContext/GroupsContext";
import { useTodosContext } from "../../contexts/TodosContext/TodosContext";
import { useAlert } from "../../contexts/AlertContext/AlertContext";
import { useConfirm } from "../../contexts/ConfirmContext/ConfirmContext";
import DeleteIcon from "../icons/DeleteIcon";

type DeleteButtonProps = {
  type: "group" | "todo";
  id: string;
  redir?: boolean;
}

export default function DeleteButton({ type, id, redir = true }: DeleteButtonProps) {
  const { todos, setAndSaveTodos } = useTodosContext();
  const { groups, setAndSaveGroups } = useGroupsContext();
  const router = useRouter();
  const showAlert = useAlert();
  const showConfirm = useConfirm();

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
        message: "Deleting this group will also delete all tasks belonging to the group. Are you sure?",
        cancelText: "Cancel",
        confirmText: "Yes, delete this group",
        onConfirm: () => {
          setTimeout(() => {
            showAlert({ message: "Group deleted" });
            setAndSaveTodos(todos.filter(nextTodo => nextTodo.group != id));
            setAndSaveGroups(groups.filter(nextGroup => nextGroup.id != id));
          }, 0);
          if (redir) {
            redirect();
          }

        }
      })
    }
    else {
      showConfirm({
        message: "This action can not be reversed. Are you sure?",
        cancelText: "Cancel",
        confirmText: "Yes, delete this task",
        onConfirm: () => {
          setTimeout(() => {
            showAlert({ message: "Task deleted" });
            setAndSaveTodos(todos.filter(nextTodo => nextTodo.id != id));
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
      className="button-svg bg-white rounded-md"
      onClick={handleDeleteClick}
    >
      <DeleteIcon />
    </button>
  )
}