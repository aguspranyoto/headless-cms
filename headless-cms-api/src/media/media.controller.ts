import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UploadedFile,
  UseInterceptors,
  Query,
  Req,
  Res,
  NotFoundException,
} from '@nestjs/common';
import type { Request, Response } from 'express';
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

  @Get('file/*')
  async getFile(@Req() req: Request, @Res() res: Response) {
    // Extract the wildcard path part correctly. NestJS req.params might not reliably populate index 0 for wildcards depending on the version/adapter.
    const key = req.path.replace(/^\/media\/file\//, '');
    try {
      const { stream, contentType } = await this.mediaService.getFileStream(key);
      res.setHeader('Content-Type', contentType || 'image/png');
      (stream as any).pipe(res);
    } catch (error: any) {
      console.error('S3 getFile error for key:', key, error);
      throw new NotFoundException('File not found: ' + error.message + ' (key: ' + key + ')');
    }
  }

  @Delete(':key')
  async remove(@Param('key') key: string) {
    await this.mediaService.delete(key);
    return { deleted: true };
  }
}
