// types/ICategory.ts

export interface ITag {
  title: string;
  link: string;
}

export interface ICategory {
  title: string;
  message?: string;
  image?: string;
  /** generated cover art (1200x630), shown on category cards */
  cover?: string;
  link?: string;
  lessonQuantity?: number;
  tags?: ITag[];
}
