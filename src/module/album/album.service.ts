import { Injectable } from '@nestjs/common';
import { Album } from './schema/album.schema';
import mongoose, { FilterQuery, HydratedDocument, Model, RootFilterQuery, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Media, MediaDocument } from './schema/media.schema';
import { IBasicService } from 'src/shared/interface/basic_service.interface';
import { IMedia } from 'src/shared/interface/media.interface';
import { SortUtil } from 'src/shared/util/sort_util';

@Injectable()
export class AlbumService implements IBasicService<Album> {
  constructor(
    @InjectModel(Album.name) private albumModel: Model<Album>
  ) { }

  async checkExistAlbum(_id: mongoose.Types.ObjectId | string) {
    const filterQuery = { _id };
    return await this.albumModel.countDocuments(filterQuery);
  }

  async create(data: Album) {
    data.media = data.media.map(file => {
      return { ...file, _id: new Types.ObjectId() }
    });
    const album = new this.albumModel(data);
    await album.save();
    return album;
  }

  async getAll(page: number, size: number) {
    const countTotal = await this.albumModel.countDocuments({});
    const albumsAggregate = await this.albumModel.aggregate(
      [
        {
          $addFields: {
            mediaItems: { $sum: { $size: "$media" } }
          }
        }, {
          $project: {
            media: 0
          }
        },
        { $skip: size * (page - 1) },
        { $limit: size },
      ]
    );

    const metaData = {
      data: albumsAggregate,
      paging: {
        totalItems: countTotal,
        size: size,
        page: page,
        totalPages: Math.ceil(countTotal / size),
      }
    };
    return metaData;
  }

  async getDetail(filterQuery: FilterQuery<Album>) {
    const album = await this.tranformToDetaiData(filterQuery);
    return album;
  }

  async replace(_id: mongoose.Types.ObjectId | string, data: Album) {
    const filterQuery = { _id };
    const milestone = await this.albumModel.findOneAndUpdate(filterQuery, data, { new: true });
    return milestone;
  }

  async addNewFiles(
    _id: mongoose.Types.ObjectId | string,
    newFiles: Array<IMedia> = []
  ) {
    if (!newFiles.length) {
      throw new Error('No new files to add');
    }

    newFiles = newFiles.map(file => {
      return { ...file, _id: new Types.ObjectId() }
    })
    const updateQuery = {
      $push: {
        media: { $each: newFiles }
      }
    };
    const filterQuery = { _id };
    await this.albumModel.findOneAndUpdate(filterQuery, updateQuery, { safe: true, new: true });

    const album = await this.tranformToDetaiData(filterQuery);
    return album;
  }

  async removeFiles(
    _id: mongoose.Types.ObjectId | string,
    filesWillRemove: Array<string | mongoose.Types.ObjectId> = [],
  ) {
    if (!filesWillRemove.length) {
      throw new Error('No files to remove');
    }

    const updateQuery = {
      $pull: {
        media: { _id: { $in: filesWillRemove } }
      }
    }
    const filterQuery = { _id };
    await this.albumModel.findOneAndUpdate(filterQuery, updateQuery, { safe: true, new: true });

    const album = await this.tranformToDetaiData(filterQuery);
    return album;
  }

  async itemIndexChange(_id: mongoose.Types.ObjectId | string, itemIndexChanges: Array<string | mongoose.Types.ObjectId>) {
    const filterQuery = { _id };
    const album = await this.albumModel.findOne(filterQuery);
    if (!album) {
      throw new Error('Album not found');
    }

    album.media = SortUtil.sortDocumentArrayByIndex<Media>(album.media as Array<MediaDocument>, itemIndexChanges);

    await album.save();

    const updatedAlbum = await this.tranformToDetaiData(filterQuery);
    return updatedAlbum;
  }

  async modify(_id: mongoose.Types.ObjectId | string, data: Partial<Album>) {
    const filterQuery = { _id };
    const milestone = await this.albumModel.findOneAndUpdate(filterQuery, data, { new: true });
    return milestone;
  }

  async remove(_id: mongoose.Types.ObjectId | string) {
    const filterQuery = { _id };
    const milestone = await this.albumModel.findOneAndDelete(filterQuery);
    return milestone;
  }

  private async tranformToDetaiData($match: FilterQuery<Album>): Promise<HydratedDocument<Album>> {
    return await this.albumModel.aggregate(
      [
        { $match }, {
          $addFields: {
            mediaItems: { $sum: { $size: "$media" } }
          }
        }, {
          $replaceWith: {
            $setField: {
              field: "media",
              input: "$$ROOT",
              value: {
                $sortArray: { input: "$media", sortBy: { type: 1 } }
              }
            }
          }
        }, {
          $limit: 1
        }
      ]
    ).then(res => {
      return res[0]
    });
  }
}
