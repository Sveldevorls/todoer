import { useState, useEffect, useRef } from "react";

type SelectOption = {
  label: string,
  value: string,
}

type GroupSelectorProps = {
  options: SelectOption[],
  defaultValue?: string | null,
  selectHandler: (value: string) => void,
}

export default function GroupSelector({ options, defaultValue = null, selectHandler }: GroupSelectorProps) {
  const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<SelectOption | null>(options.find(option => option.value === defaultValue) ?? null);
  const optionsListRef = useRef<HTMLUListElement | null>(null);
  const buttonRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const newSelected = options.find(option => option.value === defaultValue) ?? null;
    setSelectedOption(newSelected);
  }, [defaultValue]);

  useEffect(() => {
    if (optionsListRef.current) {
      const { top, right, bottom, left } = buttonRef.current!.getBoundingClientRect();
      console.log(top, right, bottom, left)

      // default position - beneath button
      if (optionsListRef.current.clientHeight + bottom < window.innerHeight) {
        optionsListRef.current.style.top = `${bottom}px`;
      }
      // second preference - above button if not enough space below
      else if (top - optionsListRef.current.clientHeight >= 0) {
        optionsListRef.current.style.bottom = `${window.innerHeight - top}px`;
      }
      // final resort - vertically aligned in the center of the screen
      else {
        optionsListRef.current.style.top = `${(window.innerHeight - optionsListRef.current.clientHeight) / 2}px`;
      }

      // default position - left side of parent
      if (optionsListRef.current.clientWidth + left + 8 < window.innerWidth) {
        optionsListRef.current.style.left = `${left}px`;
      }

      // second preference - right side of parent
      else if (left - optionsListRef.current.clientWidth - 8 > 0) {
        optionsListRef.current.style.left = `${right - optionsListRef.current.clientWidth}px`;
      }
    }
  }, [menuIsOpen])

  return (
    <div>
      <div
        className="flex items-center w-fit px-2 py-1 rounded-sm border-1 border-gray-400 hover:bg-zinc-200 hover:cursor-pointer"
        onClick={() => setMenuIsOpen(!menuIsOpen)}
        ref={buttonRef}
      >
        <div className="flex items-center max-w-[12em] truncate">
          {selectedOption ? <span>{selectedOption.label}</span> : <span>Add to group</span>}
        </div>
        {
          selectedOption &&
          <button
            className="ml-2 -mr-1 hover:bg-zinc-400 rounded-sm"
            onClick={
              (e) => {
                e.stopPropagation();
                setSelectedOption(null);
                selectHandler("");
              }
            }
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" strokeWidth="1.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="8,16 16,8 12,12 8,8 16,16" fill="none" />
            </svg>
          </button>
        }
      </div>
      {
        menuIsOpen &&
        <div>
          <ul className="py-1 min-w-[100px] max-w-[200px] max-h-[200px] overflow-y-auto [scrollbar-width:thin] rounded-md shadow-[0_1px_5px_0px_#00000088] bg-white fixed z-200 [scrollbar-gutter:auto]" ref={optionsListRef}>
            {options.map(option =>
              <li
                className={`py-1 px-2 w-full truncate cursor-pointer hover:bg-zinc-200
                  ${selectedOption?.value === option.value && "bg-blue-100"}
                  `}
                onClick={() => {
                  setSelectedOption(option);
                  selectHandler(option.value);
                  setMenuIsOpen(!menuIsOpen);
                }}
                key={option.value}
              >
                {option.label}
              </li>
            )}
          </ul>
          <div className="fixed inset-0 z-199" onClick={() => setMenuIsOpen(!menuIsOpen)} ></div>
        </div>
      }
    </div>
  )
}