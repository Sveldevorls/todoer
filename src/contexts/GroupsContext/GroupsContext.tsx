import { createContext, useContext } from "react";
import type { GroupObject } from "../../types";

interface GroupsContextValue {
  groups: GroupObject[];
  setAndSaveGroups: (groups: GroupObject[]) => void;
}


export const GroupsContext = createContext<GroupsContextValue | null>(null);

export function useGroupsContext() {
  const currentGroupsContext = useContext(GroupsContext);
  if (!currentGroupsContext) {
    throw new Error(
      "GroupsContext is null: is the component calling the context not in GroupsContextProvider?"
    );
  }

  return currentGroupsContext;
}