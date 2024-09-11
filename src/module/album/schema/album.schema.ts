import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Media } from "./media.schema";
import { IMedia } from "src/shared/interface/media.interface";

export type AlbumDocument = HydratedDocument<Album>;

@Schema({
  collection: 'album',
  timestamps: true
})
export class Album {
  @Prop({
    type: String,
    required: true
  })
  thumbnail: string;

  @Prop({
    type: Array<Media>
  })
  media: Array<Media>;

  @Prop({
    type: String,
    required: true
  })
  relativePath: string;

  constructor(thumbnail: string, media: Array<IMedia>, relativePath: string) {
    this.thumbnail = thumbnail;
    this.media = media;
    this.relativePath = relativePath;
  }
}

export const albumSchema = SchemaFactory.createForClass(Album);