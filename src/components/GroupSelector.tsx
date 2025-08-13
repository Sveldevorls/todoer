import { useAppSelector } from "../redux/hooks";
import Select from "./Select/Select";
import SelectItem from "./Select/SelectItem";
import type { SelectProps } from "./Select/selectTypes";

export default function GroupSelector(props: Omit<SelectProps<string>, "children">) {
  const groups = useAppSelector(state => state.groups.groups);

  return (
    <Select {...props}>
      {groups.map(group =>
        <SelectItem label={group.title} value={group.id} key={group.id} />
      )}
    </Select>
  )
}