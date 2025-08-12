export type TodoObject = {
  id: string;
  title: string;
  description: string | null;
  notes: string | null;
  group: string | null;
  date: number | null;
  isCompleted: boolean;
};

export type GroupObject = {
  id: string;
  title: string;
};
