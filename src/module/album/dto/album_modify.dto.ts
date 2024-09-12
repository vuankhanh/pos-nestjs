import { Transform, Type } from "class-transformer";
import { IsArray, IsMongoId, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import mongoose from "mongoose";

export class AlbumModifyDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber({}, { message: 'IsMain must be a number' })
  isMain: number;
}

export class AlbumModifyRemoveFilesDto {
  @IsArray({ message: 'filesWillRemove must be an array' })
  @IsMongoId({ each: true, message: 'filesWillRemove must be an array of string or ObjectId' })
  @Type(() => String)
  filesWillRemove: Array<mongoose.Types.ObjectId>;
}