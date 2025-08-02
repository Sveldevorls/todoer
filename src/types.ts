export type TodoObject = {
  id: string;
  title: string;
  description: string;
  notes: string;
  group: string;
  date: string; // "" | UNIX timestamp
  isCompleted: boolean;
};

export type GroupObject = {
  id: string;
  title: string;
};
