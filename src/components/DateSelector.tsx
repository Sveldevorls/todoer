import { useState } from "react";
import { createPortal } from "react-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type DateSelectorProps = {
  defaultDate?: Date | null;
  changeHandler: (date: number | null) => void;
}

export default function DateSelector({ defaultDate = null, changeHandler }: DateSelectorProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(defaultDate);
  const [selectorIsOpen, setSelectorIsOpen] = useState<boolean>(false);

  const OuterButton =
    ({ onClick }: { onClick?: VoidFunction }) => {
      return (
        <div
          className="flex items-center w-fit px-2 py-1 rounded-sm border-1 border-gray-400 bg-blue-100 hover:bg-blue-200 hover:cursor-pointer"
          onClick={() => {
            if (onClick) onClick();
            setSelectorIsOpen(true);
          }}
        >
          <div>
            {selectedDate ? selectedDate.toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Add date"}
          </div>
          {
            selectedDate &&
            <button
              className="ml-2 -mr-1 hover:bg-zinc-400 rounded-sm"
              onClick={
                (e) => {
                  e.stopPropagation();
                  setSelectedDate(null);
                  changeHandler(null);
                }
              }
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-gray-600" width="24" height="24" fill="none" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="8,16 16,8 12,12 8,8 16,16" fill="none" />
              </svg>
            </button>
          }
        </div >
      )
    }

  return (
    <>
      <DatePicker
        selected={selectedDate}
        onChange={(date) => {
          setSelectedDate(date);
          setSelectorIsOpen(false);
          changeHandler(date ? date.getTime() : null);
        }}
        customInput={<OuterButton />}
        popperPlacement="bottom-start"
        popperClassName="z-1"
        portalId="overlay"
      />
      {
        selectorIsOpen &&
        createPortal(
          <div className="inset-0 fixed" onClick={() => setSelectorIsOpen(false)}></div>,
          document.getElementById("overlay")!
        )
      }
    </>
  );
};