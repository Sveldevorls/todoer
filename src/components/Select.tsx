import { useState, useEffect, useRef } from "react";

type SelectOption = {
  label: string,
  value: string,
}

type SelectProps = {
  options: SelectOption[],
  defaultValue?: string | null,
  selectHandler: (value: string) => void,
}

export default function Select({ options, defaultValue = null, selectHandler }: SelectProps) {
  const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<SelectOption | null>(options.find(option => option.value === defaultValue) ?? null);
  const optionsListRef = useRef<HTMLUListElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const newSelected = options.find(option => option.value === defaultValue) ?? null;
    setSelectedOption(newSelected);
  }, [defaultValue]);

  useEffect(() => {
    if (optionsListRef.current) {
      const { top, left, bottom } = buttonRef.current!.getBoundingClientRect();

      // default position - beneath button
      if (optionsListRef.current.clientHeight + bottom < window.innerHeight) {
        optionsListRef.current.style.top = `${bottom}px`;
        optionsListRef.current.style.left = `${left}px`;
      }
      // second preference - above button if not enough space below
      else if (top - optionsListRef.current.clientHeight >= 0) {
        optionsListRef.current.style.bottom = `${window.innerHeight - top}px`;
        optionsListRef.current.style.left = `${left}px`;
      }
      // final resort - vertically aligned in the center of the screen
      else {
        optionsListRef.current.style.top = `${(window.innerHeight - optionsListRef.current.clientHeight) / 2}px`;
        optionsListRef.current.style.left = `${left}px`;
      }
    }
  }, [menuIsOpen])

  return (
    <div>
      <button
        className="button-primary bg-blue-500 w-fit max-w-[12em] truncate"
        onClick={() => setMenuIsOpen(!menuIsOpen)}
        ref={buttonRef}
      >
        {selectedOption ? <span>{selectedOption.label}</span> : <span>Add to group</span>}
      </button>
      {
        menuIsOpen &&
        <div>
          <ul className="py-1 max-w-[200px] max-h-[200px] overflow-y-auto scrollbar-thin rounded-md shadow-[0_1px_5px_0px_#00000088] bg-white absolute z-1 [scrollbar-gutter:auto]" ref={optionsListRef}>
            {options.map(option =>
              <li
                className={`p-1 pl-2 w-full truncate cursor-pointer hover:bg-zinc-200
                  ${selectedOption?.value === option.value && "bg-blue-100"}
                  `}
                onClick={() => {
                  setSelectedOption(option);
                  selectHandler(option.value);
                  setMenuIsOpen(!menuIsOpen);
                }}
                key={option.value}>
                {option.label}
              </li>
            )}
          </ul>
          <div className="fixed inset-0" onClick={() => setMenuIsOpen(!menuIsOpen)} ></div>
        </div>
      }
    </div>
  )
}