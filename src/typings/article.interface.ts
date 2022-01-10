export interface IProvider {
  _id: string;
  id?: string;
  provider: string;
}

export interface IFormattedProvider {
  id: string;
  provider: string;
}

export interface IFormattedArticle {
  id: number;
  featured: boolean;
  title: string;
  url: string;
  imageUrl: string;
  newsSite: string;
  summary: string;
  publishedAt: string;
  launches: IFormattedProvider[];
  events: IFormattedProvider[];
}

export interface IArticle {
  id: number;
  featured: boolean;
  title: string;
  url: string;
  imageUrl: string;
  newsSite: string;
  summary: string;
  publishedAt: Date;
  launches: IProvider[];
  events: IProvider[];
}