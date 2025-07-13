export type TodoObject = {
  id: string;
  title: string;
  description: string | null;
  isCompleted: boolean;
};

export type GroupObject = {
  id: string;
  title: string;
};
