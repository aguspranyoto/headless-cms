import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UploadedFile,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Query('folder') folder?: string,
  ) {
    return this.mediaService.upload(file, folder || 'uploads');
  }

  @Get()
  async list(@Query('folder') folder?: string) {
    return this.mediaService.list(folder || 'uploads');
  }

  @Delete(':key')
  async remove(@Param('key') key: string) {
    await this.mediaService.delete(key);
    return { deleted: true };
  }
}
