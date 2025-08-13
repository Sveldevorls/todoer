import { useState, useRef, useEffect } from "react";
import type { ReactNode } from "react";

export default function Menu({ children }: { children: ReactNode }) {
  const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    if (menuRef.current) {
      const { top, right, bottom, left } = buttonRef.current!.getBoundingClientRect();

      // default position - beneath button
      if (menuRef.current.clientHeight + bottom < window.innerHeight) {
        menuRef.current.style.top = `${bottom}px`;
      }
      // second preference - above button if not enough space below
      else if (top - menuRef.current.clientHeight >= 0) {
        menuRef.current.style.bottom = `${window.innerHeight - top}px`;
      }
      // final resort - vertically aligned in the center of the screen
      else {
        menuRef.current.style.top = `${(window.innerHeight - menuRef.current.clientHeight) / 2}px`;
      }

      // default position - left side of parent
      if (menuRef.current.clientWidth + left + 8 < window.innerWidth) {
        menuRef.current.style.left = `${left}px`;
      }

      // second preference - right side of parent
      else if (left - menuRef.current.clientWidth - 8 > 0) {
        menuRef.current.style.left = `${right - menuRef.current.clientWidth}px`;
      }
    }
  }, [menuIsOpen])

  return (
    <div>
      <button
        className="button-svg"
        onClick={() => setMenuIsOpen(!menuIsOpen)}
        ref={buttonRef}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
          viewBox="0 0 24 24">
          <circle cx="5" cy="12" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="19" cy="12" r="2" />
        </svg>
      </button>
      {
        menuIsOpen &&
        <>
          <ul
            className="fixed bg-white max-w-[200px] max-h-[200px] overflow-y-auto rounded-md shadow-[0_1px_5px_0px_#00000088] z-200 [scrollbar-width:thin] [scrollbar-gutter:auto] "
            onClick={() => setMenuIsOpen(false)}
            ref={menuRef}
          >
            {children}
          </ul>
          <div className="fixed inset-0 z-199 cursor-auto" onClick={() => setMenuIsOpen(!menuIsOpen)} ></div>
        </>
      }
    </div>
  )
}