import { BadRequestException, CanActivate, ExecutionContext, Injectable, InternalServerErrorException } from '@nestjs/common';
import { AlbumService } from '../album.service';
import { ConfigService } from '@nestjs/config';
import { ObjectId } from 'mongodb';
@Injectable()
export class ValidateModifyAlbumGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly albumService: AlbumService
  ) { }
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const query = request.query;
    const id = query.id;
    if(!id) {
      return false;
    }

    const filterQuery = { _id: ObjectId.createFromHexString(id) };
    const album = await this.albumService.getDetail(filterQuery);
    
    if (!album) {
      throw new BadRequestException('Album not found');
    };

    if(!album.relativePath) {
      throw new InternalServerErrorException('Album relative path not found');
    }

    const albumFolder = this.configService.get('folder.album');
    request['customParams'] = {};
    
    request.customParams.albumFolder = albumFolder;
    request.customParams.relativePath = 'product';
    
    return true;
  }
}