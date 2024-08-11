// types/ICategory.ts

export interface ITag {
  title: string;
  link: string;
}

export interface ICategory {
  title: string;
  message?: string;
  image?: string;
  link?: string;
  lessonQuantity?: number;
  tags?: ITag[];
}
