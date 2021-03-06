import { IEvent } from "./event.interface";
import { ILaunch } from "./launch.interface";

export interface IInputArticle extends Omit<IRawArticle, 'publishedAt' | 'id'> {
  id?: number;
  publishedAt: string;
  launches?: string[];
  events?: number[];
}

export interface IArticle extends Omit<IRawArticle, 'publishedAt'> {
  publishedAt: string;
  launches: ILaunch[];
  events: IEvent[];
}

export interface IRawArticle {
  id: number;
  featured: boolean;
  title: string;
  url: string;
  imageUrl: string;
  newsSite: string;
  summary: string;
  publishedAt: Date;
}