import { ApiProperty } from '@nestjs/swagger';
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from 'src/users/users.model';

interface PostCreationsAttrs {
  title: string;
  content: string;
  userId: number;
  image: string;
}

@Table({ tableName: 'posts' })
export class Post extends Model<Post, PostCreationsAttrs> {
  @ApiProperty({ example: '1', description: 'Unique identifier' })
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  declare id: number;
  @ApiProperty({ example: 'Hello World', description: 'Name of the post' })
  @Column({ type: DataType.STRING, allowNull: false })
  declare title: string;
  @ApiProperty({ example: 'Lorem ipsum...', description: 'Body of the post' })
  @Column({ type: DataType.STRING, allowNull: false })
  declare content: string;
  @ApiProperty({ example: 'Image', description: 'Image' })
  @Column({ type: DataType.STRING, allowNull: false })
  declare image: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  userId: number;

  @BelongsTo(() => User)
  author: User;
}
