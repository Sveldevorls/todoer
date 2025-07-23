import { useState } from "react";
import { useAlert } from "../contexts/AlertContext/AlertContext";
import TextareaAutosize from "react-textarea-autosize";

type TextAreaEditorProps = {
  value: string;
  placeholder?: string;
  required?: boolean;
  blurHandler: (nextValue: string) => void;
}

export default function TextareaEditor({ value, required = false, placeholder = "", blurHandler }: TextAreaEditorProps) {
  const [currValue, setCurrValue] = useState<string>(value);
  const showAlert = useAlert();

  return (
    <TextareaAutosize
      value={currValue}
      className="w-full resize-none hover:bg-gray-100 focus:outline-0"
      onChange={e => setCurrValue(e.target.value)}
      onBlur={() => {
        if (required && currValue === "") {
          setCurrValue(value);
          showAlert({ message: "This field can not be blank" });
          return
        }
        blurHandler(currValue);
      }}
      placeholder={placeholder}
    />
  )
}