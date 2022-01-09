import { Schema, model } from "mongoose";
import { IArticle } from "./article.interface";

const ArticleModel = new Schema(
  {
    _id: Number,
    featured: Boolean,
    title: String,
    url: String,
    imageUrl: String,
    newsSite: String,
    summary: String,
    publishedAt: Date,
    launches: [{ id: String, provider: String }],
    events: [{ id: String, provider: String }]
  },
);

export default model<IArticle>("Article", ArticleModel);