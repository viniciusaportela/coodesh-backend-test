import mongoose from 'mongoose';

export interface IProvider {
  id: string;
  provider: string;
}

export interface IArticle extends mongoose.Document {
  id: number;
  featured: boolean;
  title: string;
  url: string;
  imageUrl: string;
  newsSite: string;
  summary: string;
  publishedAt: string;
  launches: IProvider[];
  events: IProvider[];
}