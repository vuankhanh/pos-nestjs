import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ObjectId } from 'mongodb';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!ObjectId.isValid(value)) {
      throw new BadRequestException(`${value} is not a valid MongoDB ID`);
    }
    return ObjectId.createFromHexString(value);
  }
}

@Injectable()
export class ParseObjectIdArrayPipe implements PipeTransform {
  constructor(private readonly propertyTransform: string) { }
  transform(value: any, metadata: ArgumentMetadata) {
    value[this.propertyTransform] = value[this.propertyTransform].map((id: string) => ObjectId.createFromHexString(id))
    return value;
  }
}
