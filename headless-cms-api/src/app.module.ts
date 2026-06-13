import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './common/database/database.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { PostsModule } from './posts/posts.module';
import { MediaModule } from './media/media.module';

@Module({
  imports: [DatabaseModule, UsersModule, CategoriesModule, PostsModule, MediaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
