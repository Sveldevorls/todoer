import { useState } from "react";
import { useConfirm } from "../contexts/ConfirmContext/ConfirmContext";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { addTodo, updateTodoByField } from "../redux/todosSlice";
import type { TodoObject } from "../types";
import Select from "./Select";
import TextareaAutosize from "react-textarea-autosize";
import DateSelector from "./DateSelector";

type NewTodoModeProps = {
  mode: "new";
  defaultGroupID?: string;
  closeHandler: VoidFunction;
}

type EditModeProps = {
  mode: "edit";
  currTodo: TodoObject;
  closeHandler: VoidFunction;
}

type QuickTodoEditorProps = NewTodoModeProps | EditModeProps;

export function QuickTodoEditor(props: QuickTodoEditorProps) {
  const initTitle = props.mode === "new" ? "" : props.currTodo.title;
  const initDescription = props.mode === "new" ? "" : props.currTodo.description;
  const initGroupID = getinitGroupID();
  const initDate = props.mode === "new" ? "" : props.currTodo.date;

  const [title, setTitle] = useState<string>(initTitle);
  const [description, setDescription] = useState<string>(initDescription);
  const [groupID, setGroupID] = useState<string>(initGroupID);
  const [date, setDate] = useState<string>(initDate);

  const groups = useAppSelector(state => state.groups.groups);
  const showConfirm = useConfirm();
  const dispatch = useAppDispatch();

  console.log(date)

  function getinitGroupID() {
    if (props.mode === "new") {
      if (props.defaultGroupID) {
        return props.defaultGroupID
      }
      else {
        return ""
      }
    }
    else {
      return props.currTodo.group
    }
  }

  function handleNewTodoFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (props.mode === "new") {
      const newTodo: TodoObject = {
        id: crypto.randomUUID(),
        title: title,
        description: description,
        group: groupID,
        notes: "",
        date: date,
        isCompleted: false,
      };
      dispatch(addTodo(newTodo));
    }
    else {
      dispatch(updateTodoByField({ id: props.currTodo.id, key: "title", value: title }));
      dispatch(updateTodoByField({ id: props.currTodo.id, key: "description", value: description }));
      dispatch(updateTodoByField({ id: props.currTodo.id, key: "group", value: groupID }));
      dispatch(updateTodoByField({ id: props.currTodo.id, key: "date", value: date }));
    }

    setTitle("");
    setDescription("");
    setGroupID(initGroupID);

    if (props.mode === "edit") {
      props.closeHandler();
    }
  }


  function handleNewTodoFormCancel() {
    if (title != initTitle || description != initDescription || groupID != initGroupID || date != initDate) {
      showConfirm({
        message: "You will lose all unsaved progress if you exit. Are you sure?",
        cancelText: "Cancel",
        confirmText: "Yes, exit",
        onConfirm: props.closeHandler,
      });
    }
    else {
      props.closeHandler();
    }
  }

  return (
    <div className="border-1 border-gray-400 rounded-md w-full flex flex-col gap-2 p-2">
      <form
        className="flex flex-col"
        id="new-todo-form"
        onSubmit={e => handleNewTodoFormSubmit(e)}
      >
        <input
          type="text"
          name="title"
          className="font-bold focus:outline-0 focus:bg-gray-100"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.currentTarget.value)}
          autoFocus
          required
        />
        <TextareaAutosize
          name="description"
          className="resize-none text-sm focus:outline-0 focus:bg-gray-100"
          placeholder="Description (optional)"
          minRows={3}
          maxRows={5}
          value={description}
          onChange={e => setDescription(e.currentTarget.value)}
        />
      </form>

      <div className="flex gap-1">
        <Select
          options={groups.map(group => ({ label: group.title, value: group.id }))}
          defaultValue={groupID}
          selectHandler={setGroupID}
        />
        <DateSelector
          defaultDate={date == "" ? null : new Date(date)}
          changeHandler={(date) => setDate(date)}
        />
      </div>

      <div className="flex justify-start gap-4 border-t-1 border-gray-400 pt-2">
        <button
          className="button-secondary"
          onClick={handleNewTodoFormCancel}
        >
          Cancel
        </button>
        <button
          form="new-todo-form"
          className="button-primary min-w-[5em]"
        >
          {props.mode === "new" ? "Add todo" : "Save"}
        </button>
      </div>
    </div>
  )
}