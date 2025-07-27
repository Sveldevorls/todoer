import { useRouter } from "@tanstack/react-router";
import { useGroupsContext } from "../../contexts/GroupsContext/GroupsContext";
import { useTodosContext } from "../../contexts/TodosContext/TodosContext";
import { useAlert } from "../../contexts/AlertContext/AlertContext";
import { useConfirm } from "../../contexts/ConfirmContext/ConfirmContext";

type DeleteButtonProps = {
  type: "group" | "todo";
  id: string;
}

export default function DeleteButton({ type, id }: DeleteButtonProps) {
  const { todos, setAndSaveTodos } = useTodosContext();
  const { groups, setAndSaveGroups } = useGroupsContext();
  const router = useRouter();
  const showAlert = useAlert();
  const showConfirm = useConfirm();

  function handleDeleteClick() {
    function redir() {
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
          redir();
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
          redir();
        },
      })
    }


  }

  return (
    <button
      className="button-svg bg-white rounded-md"
      onClick={handleDeleteClick}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
        <path d="M10 11v6M14 11v6" />
        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
      </svg>
    </button>
  )
}