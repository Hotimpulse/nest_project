import { HttpException, HttpStatus, Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/users/users.model';
import { Post } from './posts.model';
import { FilesModule } from 'src/files/files.module';
import { MulterModule } from '@nestjs/platform-express';
import * as path from 'path';
import multer from 'multer';

@Module({
  providers: [PostsService],
  controllers: [PostsController],
  imports: [
    SequelizeModule.forFeature([User, Post]),
    FilesModule,
    MulterModule.register({
      storage: multer.memoryStorage(),
      dest: path.join(__dirname, '..', 'static'),
      fileFilter: (req, file, callback) => {
        const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

        if (allowedMimes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(new HttpException('Invalid file type', HttpStatus.BAD_REQUEST), false);
        }
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  ],
})
export class PostsModule {}
