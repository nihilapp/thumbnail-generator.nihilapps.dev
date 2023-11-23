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

export type CreateFolder = {
  folderName: string;
}

export type UploadImage = {
  folderId: string;
  image: string;
  imageName: string;
}

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};
