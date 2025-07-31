import { useEffect, useState, type ReactNode, type RefObject } from "react"
import { createPortal } from "react-dom";
import useOnScreen from "../hooks/useOnScreen";

type HeaderProps = {
  title: string;
  titleRef: RefObject<HTMLDivElement | null>;
  leftButtons?: ReactNode[];
  rightButtons?: ReactNode[];
}

export default function Header({ title, titleRef, leftButtons = [], rightButtons = [] }: HeaderProps) {
  const [domReady, setDomReady] = useState<boolean>(false);
  const isOnScreen = useOnScreen(titleRef);

  useEffect(() => {
    setDomReady(true);
  }, [])

  return (
    domReady ?
      createPortal(
        <header
          className={`grid grid-cols-[1fr_minmax(0,auto)_1fr] gap-4 h-14 w-full bg-white border-b-1 transition-[padding] duration-500ms ease-linear
            ${isOnScreen ? "border-none" : "border-gray-300"}
            `}
        >
          <div className="flex items-center min-h-8">
            {...leftButtons}
          </div>
          <h1 className={`flex items-center font-black text-xl transition-opacity
            ${isOnScreen ? "opacity-0" : "opacity-100"}
            `}>
            {
              !isOnScreen &&
              <div className="truncate">
                {title}
              </div>
            }
          </h1>
          <div className="flex justify-end gap-2 items-center min-h-8">
            {...rightButtons}
          </div>
        </header>
        ,
        document.getElementById("header")!
      )
      :
      null
  )
}