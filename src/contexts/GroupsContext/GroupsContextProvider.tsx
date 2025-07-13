import { useState, type ReactNode } from "react";
import { GroupsContext } from "./GroupsContext";
import type { GroupObject } from "../../types";

export default function GroupsContextProvider({ children }: { children: ReactNode }) {
  const [groups, setGroups] = useState<GroupObject[]>(initializeGroups());

  function initializeGroups(): GroupObject[] | [] {
    const localGroups = localStorage.getItem("groups");
    return localGroups ? JSON.parse(localGroups) : [];
  }

  function setAndSaveGroups(groups: GroupObject[]) {
    setGroups(groups);
    localStorage.setItem("groups", JSON.stringify(groups));
  }

  return (
    <GroupsContext.Provider value={{ groups, setAndSaveGroups }}>
      {children}
    </GroupsContext.Provider>
  )
}