import { Body, Controller, Delete, Get, Patch, Post, Query, Req, UploadedFiles, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { AlbumService } from './album.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ValidateCreateAlbumGuard } from './guards/validate_create_album.guard';
import { AlbumDto } from './dto/album.dto';
import { FilesProccedInterceptor } from 'src/shared/interceptors/files_procced.interceptor';
import { Album } from './schema/album.schema';
import { FormatResponseInterceptor } from 'src/shared/interceptors/format_response.interceptor';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { ValidateModifyAlbumGuard } from './guards/validate_modify_album.guard';
import { Request } from 'express';
import { ChangeUploadfilesNamePipe } from 'src/shared/pipes/change-uploadfile-name.pipe';
import { DiskStoragePipe } from 'src/shared/pipes/disk-storage.pipe';
import { Types } from 'mongoose';
import { ParseObjectIdArrayPipe } from 'src/shared/pipes/parse_objectId_array.pipe';
import { AlbumModifyItemIndexChangeDto, AlbumModifyRemoveFilesDto } from './dto/album_modify.dto';
import { FilesProcessPipe } from 'src/shared/pipes/file_process.pipe';
import { IAlbum, IMedia } from 'src/shared/interface/media.interface';
import { memoryStorageMulterOptions } from 'src/constant/file.constanst';
import { MongoIdDto } from 'src/shared/dto/mongodb.dto';

@Controller('album')
export class AlbumController {
  constructor(
    private readonly albumService: AlbumService
  ) { }

  @Get()
  @UseInterceptors(FormatResponseInterceptor)
  async get() {
    return await this.albumService.getDetail({});
  }

  @Post()
  @UseGuards(ValidateCreateAlbumGuard)
  @UsePipes(ValidationPipe)
  @UseInterceptors(
    FilesInterceptor('files', null, memoryStorageMulterOptions),
    FilesProccedInterceptor,
    FormatResponseInterceptor
  )
  async create(
    @Req() req: Request,
    @Query('name') name: string,
    @Query('route') route: string,
    @Body() body: AlbumDto,
    @UploadedFiles(ChangeUploadfilesNamePipe, FilesProcessPipe, DiskStoragePipe) medias: Array<IMedia>
  ) {
    const relativePath = req['customParams'].relativePath + '/' + route;

    const mainMedia = medias[body.isMain] || medias[0];
    const thumbnail = mainMedia.thumbnailUrl;

    const album: IAlbum = {
      name,
      route,
      thumbnail,
      media: medias,
      relativePath
    }
    const albumDoc: Album = new Album(album);
    const createdAlbum = await this.albumService.create(albumDoc);
    return createdAlbum;
  }

  @Patch('add-new-files')
  @UseGuards(AuthGuard, ValidateModifyAlbumGuard)
  @UsePipes(ValidationPipe)
  @UseInterceptors(
    FilesInterceptor('files', null, memoryStorageMulterOptions),
    FilesProccedInterceptor,
    FormatResponseInterceptor
  )
  async addNewFiles(
    @Query(new ValidationPipe({ whitelist: true })) { id }: MongoIdDto,
    @UploadedFiles(ChangeUploadfilesNamePipe, FilesProcessPipe, DiskStoragePipe) medias: Array<IMedia>
  ) {
    const _id = new Types.ObjectId(id);
    const updatedAlbums = await this.albumService.addNewFiles({ _id }, medias);
    return updatedAlbums;
  }

  @Patch('remove-files')
  // @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @UseInterceptors(
    FormatResponseInterceptor
  )
  async removeFiles(
    @Query(new ValidationPipe({ whitelist: true })) { id }: MongoIdDto,
    @Body(new ValidationPipe({ transform: true }), new ParseObjectIdArrayPipe('filesWillRemove')) body: AlbumModifyRemoveFilesDto,
  ) {
    const _id = new Types.ObjectId(id);
    const updatedAlbums = await this.albumService.removeFiles({ _id }, body.filesWillRemove);
    return updatedAlbums;
  }

  @Patch('item-index-change')
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @UseInterceptors(
    FormatResponseInterceptor
  )
  async itemIndexChange(
    @Query(new ValidationPipe({ whitelist: true })) { id }: MongoIdDto,
    @Body(new ValidationPipe({ transform: true }), new ParseObjectIdArrayPipe('newItemIndexChange')) body: AlbumModifyItemIndexChangeDto,
  ) {
    const _id = new Types.ObjectId(id);
    const updatedAlbums = await this.albumService.itemIndexChange({ _id }, body.newItemIndexChange);
    return updatedAlbums;
  }

  @Delete()
  @UseGuards(AuthGuard, ValidateModifyAlbumGuard)
  @UseInterceptors(FormatResponseInterceptor)
  async remove(
    @Query(new ValidationPipe({ whitelist: true })) { id }: MongoIdDto,
  ) {
    const _id = new Types.ObjectId(id);
    return await this.albumService.remove({ _id });
  }

}
