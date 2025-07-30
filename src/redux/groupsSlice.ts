import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { GroupObject } from "../types";

interface GroupsState {
  groups: GroupObject[];
}

const initialGroups = JSON.parse(localStorage.getItem("groups") ?? "[]");
const initialState: GroupsState = {
  groups: initialGroups,
};

export const groupsSlice = createSlice({
  name: "todos",
  initialState: initialState,
  reducers: {
    addGroup: (state: GroupsState, action: PayloadAction<GroupObject>) => {
      state.groups.push(action.payload);
    },
    deleteGroup: (state: GroupsState, action: PayloadAction<string>) => {
      state.groups = state.groups.filter((group) => group.id != action.payload);
    },
    updateGroupTitle: (
      state: GroupsState,
      action: PayloadAction<{ id: string; value: string }>
    ) => {
      const { id, value } = action.payload;
      const editedGroup = state.groups.find((group) => group.id === id);
      if (editedGroup) {
        editedGroup.title = value;
      }
    },
  },
});

export const { addGroup, deleteGroup, updateGroupTitle } = groupsSlice.actions;
export default groupsSlice.reducer;
