import type { ReactNode } from "react";

export type SelectItemValueType = string | number;

export type SelectItemProps<T extends SelectItemValueType> = {
  label: string;
  value: T;
};

export type SelectProps<T extends SelectItemValueType> = {
  defaultLabel?: string;
  defaultValue?: T | null;
  selectHandler: (value: T) => void;
  removeHandler: (value: null) => void;
  children: ReactNode;
};
