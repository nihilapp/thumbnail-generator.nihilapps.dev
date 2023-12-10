export type UserWithoutPassword = {
  id: string;
  userName: string;
  email: string;
  provider: string;
}

export interface IThumbnails {
  width?: number;
  height?: number;
  image_path?: string;
  id?: string;
  user_id: string;
  title: string;
  sub_title?: string;
  text_red?: number;
  text_green?: number;
  text_blue?: number;
  bg_red?: number;
  bg_green?: number;
  bg_blue?: number;
  bg_src?: string;
  bg_position?: number;
  image_link?: string;
  created?: string;
  updated?: string;
}
