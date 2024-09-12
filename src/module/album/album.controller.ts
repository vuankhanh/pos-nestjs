import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UploadedFiles, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
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
import { ParseObjectIdArrayPipe, ParseObjectIdPipe } from 'src/shared/pipes/parse_objectId_array.pipe';
import { AlbumModifyRemoveFilesDto } from './dto/album_modify.dto';
import { FilesProcessPipe } from 'src/shared/pipes/file_process.pipe';
import { IAlbum, IMedia } from 'src/shared/interface/media.interface';
import { memoryStorageMulterOptions } from 'src/constant/file.constanst';

@Controller('album')
// @UseGuards(AuthGuard)
@UsePipes(ValidationPipe)
export class AlbumController {
  constructor(
    private readonly albumService: AlbumService
  ) { }

  @Get()
  @UseInterceptors(FormatResponseInterceptor)
  async getAll(
    @Query('name') name: string,
    @Query('page') page: number = 1,
    @Query('size') size: number = 10
  ) {
    const filterQuery = {};
    if (name) filterQuery['name'] = { $regex: name, $options: 'i' };
    const metaData = await this.albumService.getAll(filterQuery, page, size);

    return metaData;
  }

  @Get(':id')
  @UseInterceptors(FormatResponseInterceptor)
  async getDetail(
    @Param('id', new ParseObjectIdPipe()) id: string
  ) {
    const filterQuery = { _id: id };
    return await this.albumService.getDetail(filterQuery);
  }

  @Post()
  @UseGuards(ValidateCreateAlbumGuard)
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
  @UseGuards(ValidateModifyAlbumGuard)
  @UseInterceptors(
    FilesInterceptor('files', null, memoryStorageMulterOptions),
    FilesProccedInterceptor,
    FormatResponseInterceptor
  )
  async addNewFiles(
    @Query('id', new ParseObjectIdPipe()) id: string,
    @UploadedFiles(ChangeUploadfilesNamePipe, FilesProcessPipe, DiskStoragePipe) medias: Array<IMedia>
  ) {
    const queryFilter = { _id: id };
    const updatedAlbums = await this.albumService.addNewFiles(queryFilter, medias);
    return updatedAlbums;
  }

  @Patch('remove-files')
  @UseInterceptors(
    FormatResponseInterceptor
  )
  async removeFiles(
    @Query('id', new ParseObjectIdPipe()) id: string,
    @Body(new ValidationPipe({ transform: true }), new ParseObjectIdArrayPipe('filesWillRemove')) body: AlbumModifyRemoveFilesDto,
  ) {
    const queryFilter = { _id: id };
    const updatedAlbums = await this.albumService.removeFiles(queryFilter, body.filesWillRemove);
    return updatedAlbums;
  }

  @Delete(':id')
  @UseInterceptors(FormatResponseInterceptor)
  async remove(
    @Param('id', new ParseObjectIdPipe()) id: string,
  ) {
    const queryFilter = { _id: id };
    return await this.albumService.remove(queryFilter);
  }

}
