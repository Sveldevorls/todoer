import { useState, type ReactNode } from "react"

type AccordionProps = {
  title: string,
  defaultOpen?: boolean,
  children: ReactNode
}

export default function Accordion({ title, defaultOpen = false, children }: AccordionProps) {
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);

  return (
    <div className="w-full">
      <h3
        className="flex justify-between pb-2 text-lg font-bold border-b-1 border-gray-400"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        <svg width="24" height="24" viewBox="0 0 24 24"
          className={`stroke-gray-600 transition-transform
              ${isOpen ? "rotate-0" : "-rotate-90"}
            `}
        >
          <line x1="6" y1="10" x2="12" y2="16" strokeWidth="1.1" />
          <line x1="18" y1="10" x2="12" y2="16" strokeWidth="1.1" />
        </svg>
      </h3>
      <div className={`grid transition-all duration-500
        ${isOpen ? "mb-8 grid-rows-[1fr]" : "grid-rows-[0fr]"}
        `}
      >
        <div className="overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  )
}