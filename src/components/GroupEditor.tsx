import { useRef, useState } from "react";
import { useAppDispatch } from "../redux/hooks";
import { useBlocker, useNavigate } from "@tanstack/react-router";
import { useConfirm } from "../contexts/ConfirmContext/ConfirmContext";
import type { GroupObject } from "../types";
import { addGroup, updateGroupTitle } from "../redux/groupsSlice";

type NewTodoModeProps = {
  mode: "new";
  closeHandler: VoidFunction;
}

type EditModeProps = {
  mode: "edit";
  currGroup: GroupObject;
  closeHandler: VoidFunction;
}

type GroupEditorProps = NewTodoModeProps | EditModeProps;

export default function GroupEditor(props: GroupEditorProps) {
  const initGroupName = props.mode === "new" ? "" : props.currGroup.title
  const [groupName, setGroupName] = useState<string>(initGroupName);

  const formRef = useRef<HTMLFormElement | null>(null);
  const showConfirm = useConfirm();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useBlocker({
    shouldBlockFn: ({ next }) => {
      if (groupName === initGroupName) {
        return false
      }
      else {
        showConfirm({
          message: "You will lose all unsaved progress if you exit. Are you sure?",
          cancelText: "Cancel",
          confirmText: "Yes, exit",
          onConfirm: () => navigate({ to: next.pathname, ignoreBlocker: true })
        })
      }
      return true
    }
  });

  function handleNewGroupFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (props.mode === "new") {
      const newGroup: GroupObject = {
        id: crypto.randomUUID(),
        title: groupName
      };
      dispatch(addGroup(newGroup));
    }
    else {
      dispatch(updateGroupTitle({ id: props.currGroup.id, value: groupName }))
    }

    setGroupName("");

    if (props.mode === "edit") {
      props.closeHandler();
    }
  }

  function handleNewGroupFormCancel() {
    if (groupName === initGroupName) {
      props.closeHandler();
    }
    else {
      showConfirm({
        message: "You will lose all unsaved progress if you exit. Are you sure?",
        cancelText: "Cancel",
        confirmText: "Yes, exit",
        onConfirm: () => {
          setGroupName("");
          props.closeHandler();
        },
      })
    }
  }

  return (
    <div className="border-1 border-gray-400 rounded-md w-full flex flex-col gap-4 p-2">
      <form
        className="flex flex-col"
        id="new-group-form"
        ref={formRef}
        onSubmit={(e) => handleNewGroupFormSubmit(e)}
      >
        <input
          type="text"
          value={groupName}
          className="font-bold text-lg focus:outline-0 focus:bg-gray-100"
          placeholder="Title"
          onChange={e => setGroupName(e.target.value)}
          required
          autoFocus
        />
      </form>
      <div className="flex justify-start gap-4">
        <button
          className="button-secondary"
          onClick={handleNewGroupFormCancel}
        >
          Cancel
        </button>
        <button
          form="new-group-form"
          className="button-primary"
        >
          {props.mode === "new" ? "Add group" : "Save"}
        </button>
      </div>
    </div>
  )
}