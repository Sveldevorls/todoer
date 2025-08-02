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
        <button className="button-secondary bg-blue-100" onClick={() => { onClick(); setSelectorIsOpen(true) }}>
          {selectedDate ? selectedDate.toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Add date"}
        </button>
      )
    }

  return (
    <>
      <DatePicker
        selected={selectedDate}
        onChange={(date) => {
          setSelectedDate(date);
          setSelectorIsOpen(false);
          changeHandler(date == null ? "" : date?.toString());
        }}
        customInput={<OuterButton />}
      />
      {
        selectorIsOpen &&
        <div
          className="fixed inset-0"
          onClick={() => setSelectorIsOpen(false)}
        >
        </div>
      }
    </>
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