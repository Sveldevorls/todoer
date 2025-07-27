import { useEffect, useState, type ReactNode, type RefObject } from "react"
import { createPortal } from "react-dom";
import useOnScreen from "../hooks/useOnScreen";

type HeaderProps = {
  title: string;
  titleRef: RefObject<HTMLDivElement>;
  leftButtons?: ReactNode[];
  rightButtons?: ReactNode[];
}

export default function Header({ title, titleRef, leftButtons = [], rightButtons = [] }: HeaderProps) {
  const [domReady, setDomReady] = useState<boolean>(false);
  const isOnScreen = useOnScreen(titleRef);
  const sideWidth = `${Math.max(leftButtons.length, rightButtons.length) * 32}px`

  useEffect(() => {
    setDomReady(true);
  }, [])

  return (
    domReady ?
      createPortal(
        <header
          className={`flex justify-center items-center h-14 w-full bg-white border-b-1 transition-[padding]
            ${isOnScreen ? "border-none" : "border-gray-300"}
            `}
        >
          <div className="flex mx-4 min-h-8" style={{ width: sideWidth }}>
            {...leftButtons}
          </div>
          <h1 className={`font-black text-xl transition-opacity truncate mx-auto
            ${isOnScreen ? "opacity-0" : "opacity-100"}
            `}>
            {title}
          </h1>
          <div className="flex mx-4 min-h-8" style={{ width: sideWidth }}>
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