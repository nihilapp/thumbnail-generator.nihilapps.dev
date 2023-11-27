export type SignUpData = {
  email: string;
  userName: string;
  password: string;
}

export type SignInData = {
  email: string;
  password: string;
}

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

export type RefreshAccessToken = {
  access_token: string;
  scope: string;
  expires_in: number;
  token_type: string;
}

export type ApiResponse<T> = {
  response: T;
  message: string;
}
