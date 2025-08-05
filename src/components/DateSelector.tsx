import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type DateSelectorProps = {
  defaultDate?: Date | null;
  changeHandler: (date: string) => void;
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
                  changeHandler("");
                }
              }
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" strokeWidth="1.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="8,16 16,8 12,12 8,8 16,16" fill="none" />
              </svg>
            </button>
          }
        </div>
      )
    }

  return (
    <div>
      <div className="relative z-200">
        <DatePicker
          selected={selectedDate}
          onChange={(date) => {
            setSelectedDate(date);
            setSelectorIsOpen(false);
            changeHandler(date == null ? "" : date.getTime().toString());
          }}
          customInput={<OuterButton />}
          popperPlacement="bottom-start"
        />
      </div>
      {
        selectorIsOpen &&
        <div
          className="fixed inset-0 z-199"
          onClick={() => setSelectorIsOpen(false)}
        >
        </div>
      }
    </div>
  );
};

// may switch to a custom one
/* import { useState } from "react";

export default function DateSelector({ defaultDate = null }: { defaultDate: Date | null }) {
  const [selectorIsOpen, setSelectorIsOpen] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(defaultDate)

  return (
    <>
      <button onClick={() => setSelectorIsOpen(!selectorIsOpen)} className="button-secondary">
        Date
      </button>
      {
        selectorIsOpen &&
        <div>
          <div>
            Today
          </div>
          <div>
            Tomorrow
          </div>
        </div>
      }
    </>
  )
} */