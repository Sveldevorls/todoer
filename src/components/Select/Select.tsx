import React, { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom";
import type { SelectItemValueType, SelectProps } from "./selectTypes";

export default function Select<T extends SelectItemValueType>({
  children,
  defaultLabel = "Click to select",
  defaultValue = null,
  selectHandler,
  removeHandler
}: SelectProps<T>) {
  const [selectIsOpen, setSelectIsOpen] = useState<boolean>(false);
  const [selectedLabel, setSelectedLabel] = useState<string>(defaultLabel);
  const [selectedValue, setSelectedValue] = useState<SelectItemValueType | null>(defaultValue);
  const optionsListRef = useRef<HTMLUListElement | null>(null);
  const buttonRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (optionsListRef.current) {
      const { top, right, bottom, left } = buttonRef.current!.getBoundingClientRect();

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
  }, [selectIsOpen])

  function handleSelectClick(e: React.MouseEvent<HTMLUListElement>) {
    const target = e.target as HTMLElement;
    if (target.dataset.value === undefined || target.dataset.label === undefined) return;

    const parsedValue =
      Number.isNaN(Number(target.dataset.value)) ?
        target.dataset.value :
        Number(target.dataset.value);

    setSelectedValue(target.dataset.value);
    setSelectedLabel(target.dataset.label);
    setSelectIsOpen(false);
    selectHandler(parsedValue as T);
  }

  function handleRemoveSelectClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();

    setSelectedValue(null);
    setSelectedLabel(defaultLabel);
    setSelectIsOpen(false);
    removeHandler(null);
  }

  return (
    <div className="flex flex-grow min-w-0 basis-[100px] shrink-0 max-w-[200px] mr-8">
      <div
        className="flex items-center min-w-0 px-2 py-1 rounded-sm border-1 border-gray-400 hover:bg-zinc-200 cursor-pointer"
        onClick={() => setSelectIsOpen(true)}
        ref={buttonRef}
      >
        {selectedValue ? selectedLabel : defaultLabel}
        {
          selectedValue &&
          <button
            className="ml-2 -mr-1 rounded-sm hover:bg-zinc-400"
            onClick={e => handleRemoveSelectClick(e)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-gray-600" width="24" height="24" fill="none" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="8,16 16,8 12,12 8,8 16,16" fill="none" />
            </svg>
          </button>
        }
      </div>
      {
        selectIsOpen &&
        createPortal(
          <div>
            <ul
              className="fixed z-1 py-1 min-w-[100px] max-w-[200px] max-h-[200px] overflow-y-auto bg-white rounded-md shadow-[0_1px_5px_0px_#00000088] [scrollbar-width:thin] [scrollbar-gutter:auto]"
              ref={optionsListRef}
              onClick={e => handleSelectClick(e)}
            >
              {children}
            </ul>
            <div className="fixed inset-0" onClick={(prev) => setSelectIsOpen(!prev)} ></div>
          </div>,
          document.getElementById("overlay")!
        )

      }
    </div>
  )
}