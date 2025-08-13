import type { SelectItemProps, SelectItemValueType } from "./selectTypes"

export default function SelectItem<T extends SelectItemValueType>({ label, value }: SelectItemProps<T>) {
  return (
    <li
      className={`py-1 px-2 w-full truncate cursor-pointer hover:bg-zinc-200`}
      data-value={value}
      data-label={label}
    >
      {label}
    </li>
  )
}