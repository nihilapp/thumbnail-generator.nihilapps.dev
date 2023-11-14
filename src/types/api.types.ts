export type Board = {
  id: number;
  userId: number;
  title: string;
  content: string;
};

export type EditBoard = {
  index: number;
  board: Partial<Board>;
};
