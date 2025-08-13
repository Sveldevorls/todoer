import type { HTMLAttributes, ReactNode } from "react"

interface MenuItemProps extends HTMLAttributes<HTMLLIElement> {
  children: ReactNode;
}

export default function MenuItem({ children, ...rest }: MenuItemProps) {
  return (
    <li className="flex items-center gap-1 px-2 py-1 hover:bg-gray-100" {...rest}>
      {children}
    </li>
  )
}