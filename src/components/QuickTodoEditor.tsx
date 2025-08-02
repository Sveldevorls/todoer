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
    <div className="border-1 border-gray-400 rounded-md w-full flex flex-col gap-2 p-2 @container">
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
        <DateSelector
          defaultDate={date == "" ? null : new Date(date)}
          changeHandler={(date) => setDate(date)}
        />
      </div>

      <div className="flex border-t-1 border-gray-400 pt-2">
        <Select
          options={groups.map(group => ({ label: group.title, value: group.id }))}
          defaultValue={groupID}
          selectHandler={setGroupID}
        />
        <div className="flex gap-2 ml-auto">
          <button
            className="button-svg bg-gray-200 hover:bg-gray-300 @lg:hidden"
            onClick={handleNewTodoFormCancel}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="gray" strokeWidth="1.5" strokeLinecap="round">
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          </button>
          <button
            className="button-secondary @max-lg:hidden"
            onClick={handleNewTodoFormCancel}
          >
            Cancel
          </button>

          <button
            form="new-todo-form"
            className="button-primary p-1 @lg:hidden"
          >
            <svg width="24" height="24" viewBox="-9 0 35 20" xmlns="http://www.w3.org/2000/svg" fill="white">
              <path d="M0 0l20 10L0 20V0zm0 8v4l10-2L0 8z" />
            </svg>
          </button>
          <button
            form="new-todo-form"
            className="button-primary min-w-[5em] @max-lg:hidden"
          >
            {props.mode === "new" ? "Add todo" : "Save"}
          </button>
        </div>
      </div>
    </div>
  )
}